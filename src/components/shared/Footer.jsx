"use client";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { FaEnvelope, FaFacebook, FaHeart, FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import Logo from '@/assets/ledgerly-wt.png';
import LightLogo from '@/assets/ledgerly-wt-light.png';

const Footer = () => {
    const { resolvedTheme } = useTheme();

    if (!resolvedTheme) {
        return null;
    }
    const isDark = resolvedTheme === "dark";

    return (
        <div className="bg-dll-surface text-dll-text border-t border-dll-border">
            <footer className="container mx-auto py-10 px-6 flex flex-col gap-8">
                <div className="footerContent grid gap-8 md:grid-cols-2 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <Image src={isDark ? LightLogo : Logo} alt="Digital Life Lessons" width={150} height={42} ></Image>
                        <p className="text-dll-muted text-sm mt-3 max-w-xs leading-relaxed">
                            A quiet space to preserve what life has taught you, and to learn from what it&apos;s taught others.
                        </p>
                        <div className="socialIcons flex gap-3 mt-4">
                            <Link href="https://x.com/" target="_blank" className="text-dll-text hover:text-dll-primary w-9 h-9 border border-dll-border flex items-center justify-center rounded-full">
                                <FaXTwitter size={14} ></FaXTwitter>
                            </Link>
                            <Link href="https://www.facebook.com/" target="_blank" className="text-dll-text hover:text-dll-primary w-9 h-9 border border-dll-border flex items-center justify-center rounded-full">
                                <FaFacebook size={14} ></FaFacebook>
                            </Link>
                            <Link href="https://www.linkedin.com/" target="_blank" className="text-dll-text hover:text-dll-primary w-9 h-9 border border-dll-border flex items-center justify-center rounded-full">
                                <FaLinkedin size={14} ></FaLinkedin>
                            </Link>
                            <Link href="https://www.instagram.com/" target="_blank" className="text-dll-text hover:text-dll-primary w-9 h-9 border border-dll-border flex items-center justify-center rounded-full">
                                <FaInstagram size={14} ></FaInstagram>
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-2">
                        <h3 className="text-dll-heading font-semibold text-sm">Explore</h3>
                        <ul className="space-y-2 text-sm text-dll-muted">
                            <li><Link href="/public-lessons" className="hover:text-dll-primary">Public Lessons</Link></li>
                            <li><Link href="/pricing" className="hover:text-dll-primary">Pricing</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-1 space-y-2">
                        <h3 className="text-dll-heading font-semibold text-sm">Company</h3>
                        <ul className="space-y-2 text-sm text-dll-muted">
                            <li><Link href="/" className="hover:text-dll-primary">About Us</Link></li>
                            <li><Link href="/" className="hover:text-dll-primary">Terms of Service</Link></li>
                            <li><Link href="/" className="hover:text-dll-primary">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-1 space-y-2">
                        <h3 className="text-dll-heading font-semibold text-sm">Contact</h3>
                        <p className="flex items-center gap-2 text-sm text-dll-muted"><FaEnvelope ></FaEnvelope> support@ledgerly.app</p>
                        <p className="flex items-center gap-2 text-sm text-dll-muted"><FaMapMarkerAlt ></FaMapMarkerAlt> Dhaka, Bangladesh</p>
                    </div>
                </div>
                <div className="footerCopyRight text-dll-muted text-sm w-full flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-dll-border pt-4">
                    <p>&copy; 2026 Digital Life Lessons. All rights reserved.</p>
                    <p className="flex items-center gap-2">Made with <FaHeart className="text-dll-error" ></FaHeart> one lesson at a time.</p>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
