import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    Clock,
    MessageCircle,
    HelpCircle,
    Shield,
    Zap,
    CheckCircle,
    AlertTriangle,
    Globe,
    Users,
    ArrowLeft,
    ChevronLeft
} from 'lucide-react';

const Contact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
        priority: 'medium'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', category: '', message: '', priority: 'medium' });
        }, 2000);
    };

    const contactInfo = [
        {
            icon: Mail,
            title: "Email Support",
            details: "support@cybersafeplay.com",
            description: "Get help with technical issues and account questions",
            responseTime: "Within 24 hours",
            color: "text-primary",
            bgColor: "bg-primary/10"
        },
        {
            icon: MessageCircle,
            title: "Live Chat",
            details: "Available on website",
            description: "Instant help during business hours",
            responseTime: "Immediate response",
            color: "text-secondary",
            bgColor: "bg-secondary/10"
        },
        {
            icon: Phone,
            title: "Phone Support",
            details: "+91 9999-888-777",
            description: "Direct phone support for urgent issues",
            responseTime: "Mon-Fri, 9AM-6PM IST",
            color: "text-accent",
            bgColor: "bg-accent/10"
        }
    ];

    const officeInfo = [
        {
            title: "Headquarters",
            address: "CyberSafePlay Technologies Pvt. Ltd.\nConnaught Place, New Delhi\nDelhi 110001, India",
            icon: MapPin,
            color: "text-primary"
        },
        {
            title: "Business Hours",
            address: "Monday - Friday: 9:00 AM - 6:00 PM IST\nSaturday: 10:00 AM - 4:00 PM IST\nSunday: Closed",
            icon: Clock,
            color: "text-secondary"
        },
        {
            title: "Global Support",
            address: "24/7 online support available\nMultiple timezone coverage\nCommunity forums always active",
            icon: Globe,
            color: "text-accent"
        }
    ];

    const supportCategories = [
        { value: 'technical', label: 'Technical Support', icon: Shield },
        { value: 'billing', label: 'Billing & Subscriptions', icon: HelpCircle },
        { value: 'games', label: 'Game Issues', icon: Zap },
        { value: 'account', label: 'Account Management', icon: Users },
        { value: 'feedback', label: 'Feedback & Suggestions', icon: MessageCircle },
        { value: 'other', label: 'Other', icon: Mail }
    ];

    const faqItems = [
        {
            q: "How quickly will I receive a response?",
            a: "Email responses within 24 hours, live chat is instant during business hours.",
            icon: Clock
        },
        {
            q: "What information should I include in my message?",
            a: "Include your account email, device/browser info, and detailed description of the issue.",
            icon: HelpCircle
        },
        {
            q: "Do you provide phone support?",
            a: "Yes, phone support is available for urgent technical issues during business hours.",
            icon: Phone
        },
        {
            q: "Can I schedule a demo or consultation?",
            a: "Absolutely! We offer personalized demos for teams and educational institutions.",
            icon: Users
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-card/20 py-20">
            {/* Back Button - Fixed Position */}
            <div className="fixed top-6 left-6 z-50">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="glass-card border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 backdrop-blur-md flex items-center space-x-2 px-4 py-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                </Button>
            </div>


            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <Send className="h-16 w-16 text-primary animate-glow-pulse" />
                    </div>
                    <h1 className="text-5xl font-cyber font-bold text-primary mb-4">Contact Us</h1>
                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                        Have questions about our games, need technical support, or want to provide feedback?
                        We're here to help! Choose the best way to reach us below.
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <div className="xl:col-span-2">
                        <Card className="glass-card p-8">
                            <h2 className="text-2xl font-cyber font-bold mb-6 flex items-center space-x-3">
                                <Send className="h-6 w-6 text-primary" />
                                <span>Send us a Message</span>
                            </h2>

                            {submitStatus === 'success' && (
                                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-green-500 font-medium">Message sent successfully! We'll get back to you soon.</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Full Name *</label>
                                        <Input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="glass-card border-primary/20"
                                            placeholder="Your full name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email Address *</label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="glass-card border-primary/20"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 glass-card border border-primary/20 rounded-md bg-background"
                                        >
                                            <option value="">Select a category</option>
                                            {supportCategories.map(cat => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Priority</label>
                                        <select
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            className="w-full px-3 py-2 glass-card border border-primary/20 rounded-md bg-background"
                                        >
                                            <option value="low">Low - General inquiry</option>
                                            <option value="medium">Medium - Standard support</option>
                                            <option value="high">High - Urgent issue</option>
                                            <option value="critical">Critical - Service down</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Subject *</label>
                                    <Input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="glass-card border-primary/20"
                                        placeholder="Brief description of your inquiry"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Message *</label>
                                    <Textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="glass-card border-primary/20 min-h-[150px]"
                                        placeholder="Please provide as much detail as possible about your question or issue..."
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="cyber-button w-full md:w-auto"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Card>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        {/* Contact Methods */}
                        <div className="space-y-4">
                            {contactInfo.map((info, index) => (
                                <Card key={info.title} className="glass-card p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className={`p-3 rounded-lg ${info.bgColor}`}>
                                            <info.icon className={`h-6 w-6 ${info.color}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                                            <p className={`font-medium mb-2 ${info.color}`}>{info.details}</p>
                                            <p className="text-muted-foreground text-sm mb-2">{info.description}</p>
                                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>{info.responseTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Office Information */}
                        <Card className="glass-card p-6">
                            <h3 className="font-semibold text-lg mb-4">Office Information</h3>
                            <div className="space-y-4">
                                {officeInfo.map((info, index) => (
                                    <div key={info.title} className="flex items-start space-x-3">
                                        <info.icon className={`h-5 w-5 ${info.color} mt-0.5 flex-shrink-0`} />
                                        <div>
                                            <h4 className="font-medium mb-1">{info.title}</h4>
                                            <p className="text-sm text-muted-foreground whitespace-pre-line">{info.address}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Quick FAQ */}
                        <Card className="glass-card p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                                <HelpCircle className="h-5 w-5 text-primary" />
                                <span>Quick Answers</span>
                            </h3>
                            <div className="space-y-4">
                                {faqItems.map((item, index) => (
                                    <details key={index} className="group">
                                        <summary className="cursor-pointer text-sm font-medium hover:text-primary transition-colors flex items-center space-x-2">
                                            <item.icon className="h-4 w-4 opacity-70" />
                                            <span>{item.q}</span>
                                        </summary>
                                        <p className="mt-2 pl-6 text-sm text-muted-foreground leading-relaxed">
                                            {item.a}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Contact;
