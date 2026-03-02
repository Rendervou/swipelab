import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer, Square, Eye, Trash2, Lock, Globe, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';

interface Annotation {
  id: string;
  annotation_type: 'pin' | 'box';
  x_percent: number;
  y_percent: number;
  comment: string;
  visibility: 'public' | 'private';
  created_at: string;
  user_id: string;
  profile?: { name: string | null; avatar_url: string | null };
}

interface AnnotationPanelProps {
  annotations: Annotation[];
  annotationMode: 'view' | 'pin' | 'box';
  onSetMode: (mode: 'view' | 'pin' | 'box') => void;
  selectedAnnotation: string | null;
  onSelectAnnotation: (id: string | null) => void;
  onDeleteAnnotation: (id: string) => void;
  isAuthenticated: boolean;
  currentUserId?: string;
  designOwnerId: string;
}

export const AnnotationPanel = ({
  annotations,
  annotationMode,
  onSetMode,
  selectedAnnotation,
  onSelectAnnotation,
  onDeleteAnnotation,
  isAuthenticated,
  currentUserId,
  designOwnerId,
}: AnnotationPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Toolbar */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-sm flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            Kritik Desain
          </h3>
          <Badge variant="secondary" className="text-xs">{annotations.length}</Badge>
        </div>

        {isAuthenticated ? (
          <div className="flex gap-1">
            <Button
              variant={annotationMode === 'view' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSetMode('view')}
              className="flex-1 gap-1.5 rounded-lg text-xs"
            >
              <Eye className="h-3.5 w-3.5" />
              Lihat
            </Button>
            <Button
              variant={annotationMode === 'pin' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSetMode('pin')}
              className="flex-1 gap-1.5 rounded-lg text-xs"
            >
              <MousePointer className="h-3.5 w-3.5" />
              Pin
            </Button>
            <Button
              variant={annotationMode === 'box' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSetMode('box')}
              className="flex-1 gap-1.5 rounded-lg text-xs"
            >
              <Square className="h-3.5 w-3.5" />
              Area
            </Button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">Masuk</Link> untuk memberikan kritik
          </p>
        )}
      </div>

      {/* Annotations list */}
      <ScrollArea className="max-h-[500px]">
        <div className="p-3 space-y-2">
          {annotations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Belum ada kritik</p>
              <p className="text-xs mt-1">Gunakan tools di atas untuk menandai area desain</p>
            </div>
          ) : (
            <AnimatePresence>
              {annotations.map((ann, i) => (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className={`p-3 rounded-xl cursor-pointer transition-colors ${
                    selectedAnnotation === ann.id
                      ? 'bg-primary/10 ring-1 ring-primary/20'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onSelectAnnotation(selectedAnnotation === ann.id ? null : ann.id)}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={ann.profile?.avatar_url || undefined} />
                          <AvatarFallback className="text-[10px] bg-secondary">
                            {ann.profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium truncate">{ann.profile?.name || 'User'}</span>
                        <div className="flex items-center gap-1 ml-auto">
                          {ann.visibility === 'private' ? (
                            <Lock className="h-3 w-3 text-amber-500" />
                          ) : (
                            <Globe className="h-3 w-3 text-muted-foreground" />
                          )}
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {ann.annotation_type === 'pin' ? '📌' : '📦'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{ann.comment}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(ann.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                        {currentUserId === ann.user_id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full text-muted-foreground hover:text-destructive"
                            onClick={(e) => { e.stopPropagation(); onDeleteAnnotation(ann.id); }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
};
