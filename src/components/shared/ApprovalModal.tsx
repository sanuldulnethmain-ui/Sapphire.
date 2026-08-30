import { Shield, ShieldAlert, Check, X } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import type { ApprovalRequest } from '@/types';

export function ApprovalModal({
  request,
  onApprove,
  onCancel,
}: {
  request: ApprovalRequest | null;
  onApprove: () => void;
  onCancel: () => void;
}) {
  if (!request) return null;

  return (
    <Modal
      open={!!request}
      onClose={onCancel}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>
            <X size={16} /> Cancel
          </Button>
          <Button variant="primary" onClick={onApprove}>
            <Check size={16} /> Approve
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4 mb-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
          <ShieldAlert size={22} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Sapphire wants your approval</h2>
          <p className="text-sm text-slate-400 mt-1">
            This action requires your explicit confirmation before proceeding.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl bg-ink-300/40 border border-white/5 p-4">
          <div className="text-2xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">Action</div>
          <p className="text-sm text-white">{request.action}</p>
        </div>
        <div className="rounded-xl bg-ink-300/40 border border-white/5 p-4">
          <div className="text-2xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">Reason</div>
          <p className="text-sm text-slate-300">{request.reason}</p>
        </div>
        {request.detail && (
          <div className="rounded-xl bg-ink-300/40 border border-white/5 p-4">
            <div className="text-2xs font-medium uppercase tracking-wider text-slate-500 mb-1.5">Detail</div>
            <p className="text-sm text-slate-300 leading-relaxed">{request.detail}</p>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Shield size={14} className="text-sapphire-400" />
          <span>{request.domain} · Risk level: {request.riskLevel}</span>
        </div>
      </div>
    </Modal>
  );
}
