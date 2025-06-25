import { ArrowRight } from 'lucide-react';

export default function ProfileCard({
                                        title,
                                        value,
                                        action,
                                        icon: Icon
                                    }: {
    title: string;
    value: string | number;
    action: string;
    icon: React.ElementType;
}) {
    return (
        <div className="border rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-sm transition-shadow h-full">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-gray-500 text-xs sm:text-sm mb-1">{title}</h3>
                    <p className="text-xl sm:text-2xl font-bold">{value}</p>
                </div>
                <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-md">
                    <Icon className="text-indigo-600 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
            </div>
            <button className="mt-3 sm:mt-4 text-indigo-600 text-xs sm:text-sm font-medium flex items-center group">
                {action}
                <ArrowRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
        </div>
    );
}