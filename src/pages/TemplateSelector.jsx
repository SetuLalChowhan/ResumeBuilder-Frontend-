import { Check, Layout } from "lucide-react";
import React, { useState } from "react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    {
      id: "classic",
      name: "Classic",
      preview:
        "A clean , traditional resume format with clean sections and professinal typhography",
    },
    {
      id: "modern",
      name: "Modern",
      preview: "Sleek design with minimalistic elements and modern typography",
    },
    {
      id: "minimal-image",
      name: "Minimal Image",
      preview: "Minimal design with clean sections and simple typography",
    },
    {
      id: "minimal",
      name: "Minimal",
      preview: "Ultra-clean design with clean sections and simple typography",
    },
  ];
  return (
    <div className=" relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 ring-blue-300 hover:ring transition-all px-3 py-2 rounded-lg"
      >
        <Layout size={14} /> <span className=" max-sm:hidden">Template</span>
      </button>
      {isOpen && (
        <div className=" absolute top-full w-xs p-3 mt-2 space-y-3 z-10 bg-white rounded-md border border-gray-200 shadow-sm">
          {templates.map((template) => (
            <div
              className={`relative p-3 border rounded-md cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? "border-blue-600 bg-blue-100"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-100"
              }`}
              key={template.id}
              onClick={() => {
                onChange(template.id);
                setIsOpen(false);
              }}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <div>
                    <Check className=" w-3 h-3 text-white" />
                  </div>
                </div>
              )}

              <div className="space-y-1" >
                <h4 className=" font-medium text-gray-800">
                    {template.name}
                    <div className=" mt-2 p-2 bg-blue-50 rounded text-xs text-gray-500 italic">
                        {template.preview}
                    </div>

                </h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
