"use client";

import { useState } from "react";
import { FileUpload } from "@/components/forms/file-upload";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadVerificationDocument } from "@/lib/actions/candidate";
import { documentTypeLabels } from "@/lib/journey/labels";
import { documentUploadRules } from "@/lib/journey/schemas";
import type { DocumentType } from "@/lib/journey/types";

export function DocumentUpload({ suggested }: { suggested: DocumentType | null }) {
  const [type, setType] = useState<DocumentType | null>(suggested);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5 sm:max-w-xs">
        <Label htmlFor="document-type" className="text-sm font-semibold text-brand-950">
          Document type
        </Label>
        <Select items={documentTypeLabels} value={type} onValueChange={(value) => setType(value as DocumentType | null)}>
          <SelectTrigger id="document-type" className="h-10 w-full bg-white">
            <SelectValue placeholder="Choose a type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(documentTypeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <FileUpload
        upload={uploadVerificationDocument}
        rules={documentUploadRules}
        label="Upload a document"
        success="Document uploaded"
        fields={() => (type ? { type } : "Choose a document type first")}
      />
    </div>
  );
}
