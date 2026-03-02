import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Annotation {
  id: string;
  annotation_type: 'pin' | 'box';
  x_percent: number;
  y_percent: number;
  width_percent: number | null;
  height_percent: number | null;
  comment: string;
  visibility: 'public' | 'private';
  user_id: string;
  profile?: { name: string | null; avatar_url: string | null };
}

interface AnnotationCanvasProps {
  imageUrl: string;
  annotations: Annotation[];
  mode: 'view' | 'pin' | 'box';
  selectedAnnotation: string | null;
  onSelectAnnotation: (id: string | null) => void;
  onAddAnnotation: (annotation: {
    type: 'pin' | 'box';
    x: number;
    y: number;
    width?: number;
    height?: number;
    comment: string;
    visibility: 'public' | 'private';
  }) => void;
  isAuthenticated: boolean;
}

export const AnnotationCanvas = ({
  imageUrl,
  annotations,
  mode,
  selectedAnnotation,
  onSelectAnnotation,
  onAddAnnotation,
  isAuthenticated,
}: AnnotationCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pendingPin, setPendingPin] = useState<{ x: number; y: number } | null>(null);
  const [drawingBox, setDrawingBox] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [comment, setComment] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const getRelativePosition = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (mode !== 'pin' || !isAuthenticated) return;
    const pos = getRelativePosition(e);
    setPendingPin(pos);
    setDrawingBox(null);
    setShowForm(true);
    setComment('');
  }, [mode, isAuthenticated, getRelativePosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (mode !== 'box' || !isAuthenticated) return;
    const pos = getRelativePosition(e);
    setDrawingBox({ startX: pos.x, startY: pos.y, endX: pos.x, endY: pos.y });
    setIsDrawing(true);
    setPendingPin(null);
  }, [mode, isAuthenticated, getRelativePosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing || !drawingBox) return;
    const pos = getRelativePosition(e);
    setDrawingBox(prev => prev ? { ...prev, endX: pos.x, endY: pos.y } : null);
  }, [isDrawing, drawingBox, getRelativePosition]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !drawingBox) return;
    setIsDrawing(false);
    const w = Math.abs(drawingBox.endX - drawingBox.startX);
    const h = Math.abs(drawingBox.endY - drawingBox.startY);
    if (w > 1 && h > 1) {
      setShowForm(true);
      setComment('');
    } else {
      setDrawingBox(null);
    }
  }, [isDrawing, drawingBox]);

  const handleSubmit = () => {
    if (!comment.trim()) return;

    if (pendingPin) {
      onAddAnnotation({
        type: 'pin',
        x: pendingPin.x,
        y: pendingPin.y,
        comment: comment.trim(),
        visibility: isPrivate ? 'private' : 'public',
      });
    } else if (drawingBox) {
      const x = Math.min(drawingBox.startX, drawingBox.endX);
      const y = Math.min(drawingBox.startY, drawingBox.endY);
      const w = Math.abs(drawingBox.endX - drawingBox.startX);
      const h = Math.abs(drawingBox.endY - drawingBox.startY);
      onAddAnnotation({
        type: 'box',
        x, y, width: w, height: h,
        comment: comment.trim(),
        visibility: isPrivate ? 'private' : 'public',
      });
    }

    setPendingPin(null);
    setDrawingBox(null);
    setShowForm(false);
    setComment('');
    setIsPrivate(false);
  };

  const handleCancel = () => {
    setPendingPin(null);
    setDrawingBox(null);
    setShowForm(false);
    setComment('');
  };

  const cursorClass = mode === 'pin' ? 'cursor-crosshair' : mode === 'box' ? 'cursor-crosshair' : 'cursor-default';

  // Normalize box for rendering
  const getNormalizedBox = (box: { startX: number; startY: number; endX: number; endY: number }) => ({
    x: Math.min(box.startX, box.endX),
    y: Math.min(box.startY, box.endY),
    w: Math.abs(box.endX - box.startX),
    h: Math.abs(box.endY - box.startY),
  });

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-2xl bg-muted select-none ${cursorClass}`}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { if (isDrawing) handleMouseUp(); }}
      >
        <img
          src={imageUrl}
          alt="Design"
          className="w-full h-auto block"
          draggable={false}
        />

        {/* Existing annotations */}
        {annotations.map((ann, i) => (
          <div key={ann.id}>
            {ann.annotation_type === 'pin' ? (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: selectedAnnotation === ann.id ? 1.3 : 1 }}
                className={`absolute z-10 flex items-center justify-center h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg transition-colors ${
                  selectedAnnotation === ann.id
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                    : 'bg-primary/80 text-primary-foreground hover:bg-primary'
                }`}
                style={{ left: `${ann.x_percent}%`, top: `${ann.y_percent}%` }}
                onClick={(e) => { e.stopPropagation(); onSelectAnnotation(selectedAnnotation === ann.id ? null : ann.id); }}
              >
                <span className="text-xs font-bold">{i + 1}</span>
                {ann.visibility === 'private' && (
                  <Lock className="absolute -top-1 -right-1 h-3 w-3 text-amber-400" />
                )}
              </motion.button>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`absolute z-10 border-2 rounded-lg transition-colors ${
                  selectedAnnotation === ann.id
                    ? 'border-primary bg-primary/15'
                    : 'border-primary/60 bg-primary/5 hover:border-primary hover:bg-primary/10'
                }`}
                style={{
                  left: `${ann.x_percent}%`,
                  top: `${ann.y_percent}%`,
                  width: `${ann.width_percent}%`,
                  height: `${ann.height_percent}%`,
                }}
                onClick={(e) => { e.stopPropagation(); onSelectAnnotation(selectedAnnotation === ann.id ? null : ann.id); }}
              >
                <span className="absolute -top-3 -left-1 flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow">
                  {i + 1}
                </span>
                {ann.visibility === 'private' && (
                  <Lock className="absolute -top-1 -right-1 h-3 w-3 text-amber-400" />
                )}
              </motion.button>
            )}
          </div>
        ))}

        {/* Pending pin */}
        {pendingPin && (
          <div
            className="absolute z-20 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent border-2 border-accent-foreground/50 animate-pulse"
            style={{ left: `${pendingPin.x}%`, top: `${pendingPin.y}%` }}
          />
        )}

        {/* Drawing box */}
        {drawingBox && isDrawing && (() => {
          const nb = getNormalizedBox(drawingBox);
          return (
            <div
              className="absolute z-20 border-2 border-dashed border-accent bg-accent/10 rounded"
              style={{ left: `${nb.x}%`, top: `${nb.y}%`, width: `${nb.w}%`, height: `${nb.h}%` }}
            />
          );
        })()}

        {/* Drawn box (finished) */}
        {drawingBox && !isDrawing && showForm && (() => {
          const nb = getNormalizedBox(drawingBox);
          return (
            <div
              className="absolute z-20 border-2 border-accent bg-accent/15 rounded-lg"
              style={{ left: `${nb.x}%`, top: `${nb.y}%`, width: `${nb.w}%`, height: `${nb.h}%` }}
            />
          );
        })()}

        {/* Mode indicator */}
        {mode !== 'view' && (
          <div className="absolute top-3 left-3 z-30">
            <Badge className="bg-accent text-accent-foreground text-xs shadow">
              {mode === 'pin' ? '📌 Klik untuk pin' : '📦 Drag untuk seleksi area'}
            </Badge>
          </div>
        )}
      </div>

      {/* Comment form */}
      {showForm && (pendingPin || drawingBox) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 glass rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Tambah Kritik</span>
          </div>
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tulis kritik atau saran untuk area ini..."
            className="rounded-lg"
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSubmit(); }}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch id="visibility" checked={isPrivate} onCheckedChange={setIsPrivate} />
              <Label htmlFor="visibility" className="text-xs text-muted-foreground flex items-center gap-1">
                {isPrivate ? <><Lock className="h-3 w-3" /> Privat</> : 'Publik'}
              </Label>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel} className="rounded-full">
                Batal
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={!comment.trim()} className="rounded-full">
                Kirim
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
