import { FiArrowRight } from "react-icons/fi";

export default function Headers({title, url}){
    return (
        <div className='flex justify-between items-end mb-6 sm:mb-8 group/header'>
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <span className="h-6 w-1 bg-blue-500 rounded-full"></span>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                        {title}
                    </h2>
                </div>
            </div>

            <a 
                href={url}
                className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-all duration-300"
            >
                View All
                <FiArrowRight className="transition-transform duration-300 group-hover/header:translate-x-1" />
            </a>
        </div>
    );
}