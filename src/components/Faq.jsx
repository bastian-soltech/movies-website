import { FiHelpCircle, FiChevronDown } from "react-icons/fi";

export default function Faq() {
    const faqItems = [
        {
            question: "Is this service free?",
            answer: "Yes, NontonYuk21 is completely free to use. We do not charge any fees for streaming movies."
        },
        {
            question: "Why choose NontonYuk21?",
            answer: "We offer an extensive collection of movies, high-quality streaming, a user-friendly interface, and regular updates with the latest releases."
        },
        {
            question: "Is it safe to use?",
            answer: "Absolutely. We use industry-standard encryption and do not store user personal data. Always ensure you are on our official site."
        },
        {
            question: "How do I start watching?",
            answer: "No registration required. Simply browse our collection, pick a movie, and start your cinematic journey instantly."
        }
    ];

    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500 mb-2">
                        Common Questions
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                        FAQ
                    </h2>

                    <p className="text-slate-500 text-lg font-medium">
                        Everything you need to know about NontonYuk21
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqItems.map((item, index) => (
                        <div key={index} className="group">
                            <div className="collapse collapse-arrow glass-surface border-white/5 hover:border-white/10 rounded-2xl transition-all duration-300">
                                <input type="radio" name="faq-accordion" defaultChecked={index === 0} />

                                <div className="collapse-title font-bold text-lg text-slate-100 py-5 px-6">
                                    <span className="text-blue-500 mr-4 tabular-nums">0{index + 1}</span>
                                    {item.question}
                                </div>

                                <div className="collapse-content px-6 pb-6">
                                    <div className="pl-10 border-l border-blue-500/20">
                                        <p className="text-slate-400 leading-relaxed font-medium">{item.answer}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Support */}
                <div className="mt-16 text-center">
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-6">
                        Still have questions?
                    </p>
                    <a 
                        href="https://www.tiktok.com/@tyan.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-white text-slate-950 font-black px-10 py-4 rounded-full transition-all duration-300 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 shadow-xl shadow-white/5 uppercase tracking-widest text-sm"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </section>
    );
}