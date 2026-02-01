"use client";
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Terminal, BookOpen, Rocket, FileJson, Download, Code2 } from "lucide-react";
import { toast } from "sonner";

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    toolConfig: any;
    agentName: string;
}

export function PublishModal({ isOpen, onClose, toolConfig, agentName }: PublishModalProps) {
    const [copiedType, setCopiedType] = React.useState<'code' | 'json' | null>(null);
    const [activeTab, setActiveTab] = React.useState<'setup' | 'code' | 'json'>('setup');

    const configString = JSON.stringify(toolConfig, null, 2);

    const implementationCode = `
// Logic2Agent Helper
async function runAgent(userInput: string) {
  const response = await fetch('/api/chat-with-agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: userInput }],
      toolConfig: ${configString}
    })
  });
  return await response.json();
}
`.trim();

    const handleCopy = (text: string, type: 'code' | 'json') => {
        navigator.clipboard.writeText(text);
        setCopiedType(type);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedType(null), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([configString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${agentName.replace(/\s+/g, '_')}_config.json`;
        a.click();
        toast.success("Downloading Config...");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl">
                {/* Clean Sleek Header - Aligned with Website UI */}
                {/* Header - Compact */}
                <div className="bg-gray-50 dark:bg-gray-900/50 px-8 py-5 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="h-11 w-11 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg shrink-0">
                            <Rocket className="w-5 h-5 text-white dark:text-black" />
                        </div>
                        <div className="flex flex-col">
                            <DialogTitle className="text-lg font-black text-gray-900 dark:text-white leading-tight">
                                Publish {agentName || 'Agent'}
                            </DialogTitle>
                            <p className="text-gray-500 text-xs font-medium mt-0.5">Integration guide and config</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Centered Navigation and Action Bar - Compact */}
                    <div className="flex flex-col items-center gap-5 mb-6 text-center">
                        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
                            <button
                                onClick={() => setActiveTab('setup')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'setup'
                                    ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-400'
                                    }`}
                            >
                                <BookOpen className="w-4 h-4" />
                                Instructions
                            </button>
                            <button
                                onClick={() => setActiveTab('code')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'code'
                                    ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-400'
                                    }`}
                            >
                                <Code2 className="w-4 h-4" />
                                Wrapper Code
                            </button>
                            <button
                                onClick={() => setActiveTab('json')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'json'
                                    ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-400'
                                    }`}
                            >
                                <FileJson className="w-4 h-4" />
                                Config JSON
                            </button>
                        </div>

                        {activeTab !== 'setup' && (
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => activeTab === 'code' ? handleCopy(implementationCode, 'code') : handleCopy(configString, 'json')}
                                className="h-12 gap-3 px-10 border-gray-200 dark:border-gray-800 font-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl shadow-lg active:scale-95 transition-all"
                            >
                                {copiedType === activeTab ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                {copiedType === activeTab ? "Copied Successfully" : "Copy Agent Code"}
                            </Button>
                        )}
                    </div>

                    {/* Tab Content Area - Compact Height */}
                    <div className="min-h-[180px] flex flex-col items-center">
                        {activeTab === 'setup' && (
                            <div className="space-y-3 animate-in fade-in duration-200 w-full max-w-[620px]">
                                <div className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
                                    <h4 className="font-bold text-xs mb-2 text-gray-900 dark:text-gray-200 flex items-center gap-2">
                                        <div className="w-4 h-4 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-[9px]">1</div>
                                        Setup Backend Route
                                    </h4>
                                    <p className="text-xs text-gray-500 leading-relaxed ml-6">
                                        Ensure your application has a POST endpoint at <code className="text-black dark:text-white bg-gray-200 dark:bg-gray-800 px-1 rounded">/api/chat-with-agent</code>.
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
                                    <h4 className="font-bold text-xs mb-2 text-gray-900 dark:text-gray-200 flex items-center gap-2">
                                        <div className="w-4 h-4 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-[9px]">2</div>
                                        Integrate Wrapper
                                    </h4>
                                    <p className="text-xs text-gray-500 leading-relaxed ml-6">
                                        Copy the helper function from the <span className="text-black dark:text-white font-semibold">Wrapper Code</span> tab.
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
                                    <h4 className="font-bold text-xs mb-2 text-gray-900 dark:text-gray-200 flex items-center gap-2">
                                        <div className="w-4 h-4 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-[9px]">3</div>
                                        Load Config
                                    </h4>
                                    <p className="text-xs text-gray-500 leading-relaxed ml-6">
                                        The <span className="text-black dark:text-white font-semibold">Config JSON</span> is required for the AI to understand your graph.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'code' && (
                            <div className="animate-in slide-in-from-bottom-2 duration-300 w-full max-w-[620px]">
                                <pre className="p-5 bg-gray-950 dark:bg-black rounded-xl overflow-x-auto text-[12px] font-mono border border-gray-800 shadow-2xl max-h-[200px] scrollbar-thin">
                                    <code className="text-blue-400">
                                        {implementationCode}
                                    </code>
                                </pre>
                            </div>
                        )}

                        {activeTab === 'json' && (
                            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300 w-full max-w-[620px]">
                                <pre className="p-5 bg-gray-950 dark:bg-black rounded-xl overflow-x-auto text-[12px] font-mono border border-gray-800 shadow-2xl max-h-[150px] scrollbar-thin">
                                    <code className="text-emerald-400">
                                        {configString}
                                    </code>
                                </pre>
                                <div className="flex justify-center">
                                    <Button
                                        onClick={handleDownload}
                                        className="gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 font-extrabold px-8 border border-gray-200 dark:border-gray-700 shadow-lg py-5 rounded-xl transition-all active:scale-95 text-xs"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download JSON
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer - Compact */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/50">
                    <Button variant="ghost" size="sm" onClick={onClose} className="font-bold text-gray-500 hover:bg-transparent">
                        Cancel
                    </Button>
                    <Button
                        onClick={onClose}
                        size="sm"
                        className="bg-black dark:bg-white text-white dark:text-black font-black px-10 py-5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-xl"
                    >
                        Finish
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
