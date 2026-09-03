"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading2,
  Heading3,
  Heading4,
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link2,
  Unlink,
  Undo2,
  Redo2,
  Eraser,
  Check,
  X,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "اكتب المحتوى التعليمي للمقال هنا...",
  error,
  label,
  required,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkInputOpen, setIsLinkInputOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class: "text-emerald-400 underline hover:text-emerald-300 transition-colors",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "right",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3 text-slate-100 font-sans text-sm leading-relaxed",
        dir: "rtl",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // If editor is completely empty, send empty string for clean DB storage
      if (editor.isEmpty) {
        onChange("");
      } else {
        onChange(html);
      }
    },
  });

  // Sync initial / external value changes (e.g. when loading article in edit mode)
  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (value !== currentHtml && (editor.isEmpty || currentHtml === "<p></p>")) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-bold text-slate-200">
            {label} {required && <span className="text-emerald-400">*</span>}
          </label>
        )}
        <div className="w-full h-[350px] rounded-xl border border-slate-800 bg-slate-900/60 animate-pulse flex items-center justify-center text-xs text-slate-500">
          جاري تجهيز محرر النصوص المتقدم...
        </div>
      </div>
    );
  }

  const handleOpenLinkInput = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setIsLinkInputOpen(true);
  };

  const handleSetLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      let formattedUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith("#") && !formattedUrl.startsWith("mailto:")) {
        formattedUrl = `https://${formattedUrl}`;
      }
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: formattedUrl })
        .run();
    }
    setIsLinkInputOpen(false);
    setLinkUrl("");
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    setIsLinkInputOpen(false);
    setLinkUrl("");
  };

  const ToolButton = ({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center",
        isActive
          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800",
        disabled && "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-400"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200">
            {label} {required && <span className="text-emerald-400">*</span>}
          </label>
          <span className="text-[11px] text-slate-400">
            محرر منسق يدعم التنسيق والكتابة بالعربية
          </span>
        </div>
      )}

      <div
        className={cn(
          "w-full rounded-xl border bg-slate-900/90 transition-colors duration-200 overflow-hidden shadow-inner",
          error
            ? "border-rose-500/80 focus-within:border-rose-500"
            : "border-slate-800 focus-within:border-emerald-500"
        )}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md">
          {/* Headings */}
          <div className="flex items-center gap-0.5 pl-1.5 border-l border-slate-800">
            <ToolButton
              onClick={() => editor.chain().focus().setParagraph().run()}
              isActive={editor.isActive("paragraph") && !editor.isActive("heading")}
              title="نص عادي"
            >
              <Type className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive("heading", { level: 2 })}
              title="عنوان رئيسي (H2)"
            >
              <Heading2 className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive("heading", { level: 3 })}
              title="عنوان فرعي (H3)"
            >
              <Heading3 className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              isActive={editor.isActive("heading", { level: 4 })}
              title="عنوان جانبي (H4)"
            >
              <Heading4 className="h-4 w-4" />
            </ToolButton>
          </div>

          {/* Text Styling */}
          <div className="flex items-center gap-0.5 px-1.5 border-l border-slate-800">
            <ToolButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="غامق (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="مائل (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              title="تسطير (Ctrl+U)"
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="يتوسطه خط"
            >
              <Strikethrough className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive("code")}
              title="رمز برمجي مضمن"
            >
              <Code className="h-4 w-4" />
            </ToolButton>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center gap-0.5 px-1.5 border-l border-slate-800">
            <ToolButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              title="محاذاة لليمين"
            >
              <AlignRight className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              isActive={editor.isActive({ textAlign: "center" })}
              title="توسيط"
            >
              <AlignCenter className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              title="محاذاة لليسار"
            >
              <AlignLeft className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              isActive={editor.isActive({ textAlign: "justify" })}
              title="ضبط المحاذاة"
            >
              <AlignJustify className="h-4 w-4" />
            </ToolButton>
          </div>

          {/* Lists & Quotes */}
          <div className="flex items-center gap-0.5 px-1.5 border-l border-slate-800">
            <ToolButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="قائمة نقطية"
            >
              <List className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="قائمة رقمية"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              title="اقتباس تربوي"
            >
              <Quote className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="فاصل أفقي"
            >
              <Minus className="h-4 w-4" />
            </ToolButton>
          </div>

          {/* Links */}
          <div className="flex items-center gap-0.5 px-1.5 border-l border-slate-800">
            <ToolButton
              onClick={handleOpenLinkInput}
              isActive={editor.isActive("link")}
              title="إدراج / تعديل رابط"
            >
              <Link2 className="h-4 w-4" />
            </ToolButton>
            {editor.isActive("link") && (
              <ToolButton onClick={handleRemoveLink} title="إزالة الرابط">
                <Unlink className="h-4 w-4 text-rose-400" />
              </ToolButton>
            )}
          </div>

          {/* History & Cleanup */}
          <div className="flex items-center gap-0.5 mr-auto">
            <ToolButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="تراجع (Ctrl+Z)"
            >
              <Undo2 className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="إعادة (Ctrl+Y)"
            >
              <Redo2 className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              title="مسح كافة التنسيقات"
            >
              <Eraser className="h-4 w-4" />
            </ToolButton>
          </div>
        </div>

        {/* Inline Link Input Popover */}
        {isLinkInputOpen && (
          <div className="flex items-center gap-2 p-2 bg-slate-950 border-b border-slate-800 animate-in fade-in duration-200">
            <Link2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mr-1" />
            <input
              type="url"
              autoFocus
              dir="ltr"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSetLink();
                } else if (e.key === "Escape") {
                  setIsLinkInputOpen(false);
                }
              }}
              placeholder="https://example.com"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSetLink}
              className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              <Check className="h-3.5 w-3.5" />
              تطبيق
            </button>
            <button
              type="button"
              onClick={() => setIsLinkInputOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              title="إلغاء"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Editor Content Area */}
        <div className="relative min-h-[300px] cursor-text" onClick={() => editor.commands.focus()}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {error && <span className="text-xs text-rose-400">{error}</span>}
    </div>
  );
}
