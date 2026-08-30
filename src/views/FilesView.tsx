import { useState } from 'react';
import { FileText, Upload, Search, File, Image, FileCode, FileSpreadsheet } from 'lucide-react';
import { PageTransition, PageContainer, PageHeader, DevStateBadge } from '@/components/layout/PageShell';
import { Card, CardBody, Badge, Button, EmptyState } from '@/components/ui';
import { cn, formatRelativeTime } from '@/lib/utils';
import { files as initialFiles, projects } from '@/lib/data';
import type { FileItem } from '@/types';

const FILE_ICONS: Record<string, typeof File> = {
  PDF: FileText,
  Document: FileText,
  Markdown: FileCode,
  Image: Image,
  Spreadsheet: FileSpreadsheet,
};

export function FilesView() {
  const [files] = useState<FileItem[]>(initialFiles);
  const [search, setSearch] = useState('');

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageContainer>
      <PageTransition>
        <PageHeader
          title="Files"
          subtitle="Upload, organize, and connect files to your projects."
          icon={<FileText size={20} />}
          action={
            <Button variant="primary">
              <Upload size={16} /> Upload file
            </Button>
          }
        />

        <div className="mb-5">
          <DevStateBadge label="Development Mode — File storage not yet connected" />
        </div>

        {/* Search */}
        <div className="mb-5">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className="h-11 w-full rounded-xl bg-ink-300/40 border border-white/8 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-sapphire-500/30 outline-none transition-all"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileText size={28} />}
            title="No files found."
            description="Upload files and Sapphire will help you organize them, connect them to projects, and answer questions about their contents."
            action={<Button variant="primary"><Upload size={16} /> Upload your first file</Button>}
          />
        ) : (
          <Card>
            <div className="divide-y divide-white/5">
              {filtered.map((file) => {
                const Icon = FILE_ICONS[file.type] ?? File;
                const project = projects.find((p) => p.id === file.projectId);
                return (
                  <div key={file.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors group">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/5">
                      <Icon size={18} className="text-sapphire-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{file.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-2xs text-slate-500">{file.type}</span>
                        <span className="text-2xs text-slate-600">·</span>
                        <span className="text-2xs text-slate-500">{file.size}</span>
                        {project && (
                          <>
                            <span className="text-2xs text-slate-600">·</span>
                            <span className="text-2xs text-sapphire-400">{project.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-2xs text-slate-600 shrink-0 hidden sm:block">{formatRelativeTime(file.createdAt)}</span>
                    <Badge tone="success" className="shrink-0">{file.status}</Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </PageTransition>
    </PageContainer>
  );
}
