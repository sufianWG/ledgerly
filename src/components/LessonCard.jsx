import Image from "next/image";
import Link from "next/link";
import { FiLock } from "react-icons/fi";

const LessonCard = ({ lesson, isLocked }) => {
    // premium lesson + free/logged-out dekhchen mane blur kore lock overlay dekhabe
    if (isLocked) {
        return (
            <article className="relative bg-dll-surface rounded-2xl overflow-hidden border border-dll-border">
                <div className="relative h-48 overflow-hidden">
                    <Image src={lesson.image || "https://picsum.photos/seed/locked/600/400"} alt="" fill className="object-cover blur-md scale-110"></Image>
                    <span className="absolute top-3.5 left-3.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-dll-accent text-white flex items-center gap-1">
                        <FiLock size={11}></FiLock> Premium
                    </span>
                </div>
                <div className="p-5 relative">
                    <div className="blur-sm select-none pointer-events-none">
                        <h3 className="font-serif text-lg font-semibold text-dll-heading mb-2 leading-snug">{lesson.title}</h3>
                        <div className="w-7 h-7 rounded-full bg-dll-border"></div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-dll-surface/85 backdrop-blur-[2px]">
                        <div className="w-11 h-11 rounded-full bg-dll-accent/15 flex items-center justify-center mb-3">
                            <FiLock size={18} className="text-dll-accent"></FiLock>
                        </div>
                        <p className="text-sm font-semibold text-dll-heading mb-0.5">Premium Lesson</p>
                        <p className="text-xs text-dll-muted mb-3">Upgrade to unlock</p>
                        <Link href="/pricing" className="bg-dll-accent text-white text-xs font-semibold px-4 py-2 rounded-full">Upgrade Now</Link>
                    </div>
                </div>
            </article>
        );
    }

    return (
        <Link href={`/public-lessons/${lesson._id}`} className="group bg-dll-surface rounded-2xl overflow-hidden border border-dll-border block hover:-translate-y-1 transition-transform">
            <div className="relative h-48 overflow-hidden">
                <Image src={lesson.image || `https://picsum.photos/seed/${lesson._id}/600/400`} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500"></Image>
                <span className="absolute top-3.5 left-3.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/95 text-dll-primary">{lesson.category}</span>
                <span className="absolute top-3.5 right-3.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-dll-primary/90 text-white">{lesson.accessLevel}</span>
            </div>
            <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-dll-heading mb-2 leading-snug group-hover:text-dll-accent transition">{lesson.title}</h3>
                <p className="text-sm text-dll-muted leading-relaxed mb-4 line-clamp-2">{lesson.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-dll-border">
                    <div className="flex items-center gap-2">
                        <Image src={lesson.creatorImage || "https://i.pravatar.cc/100"} alt={lesson.creatorName} width={28} height={28} className="rounded-full object-cover"></Image>
                        <span className="text-xs font-medium text-dll-heading">{lesson.creatorName}</span>
                    </div>
                    <span className="text-xs text-dll-muted">{new Date(lesson.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </Link>
    );
};

export default LessonCard;
