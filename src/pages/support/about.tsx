import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Shield,
    Target,
    Users,
    Zap,
    Heart,
    Code,
    Globe,
    Award,
    TrendingUp,
    Rocket,
    Star,
    Coffee,
    Calendar,
    MapPin,
    ArrowLeft,
    ChevronLeft
} from 'lucide-react';

const About = () => {
    const navigate = useNavigate();

    const stats = [
        { label: "Active Learners", value: "50K+", icon: Users, color: "text-primary", change: "+12% this month" },
        { label: "Games Completed", value: "200K+", icon: Target, color: "text-secondary", change: "+23% this month" },
        { label: "Skills Mastered", value: "1M+", icon: Shield, color: "text-accent", change: "+18% this month" },
        { label: "Countries", value: "25+", icon: Globe, color: "text-primary", change: "3 new this month" }
    ];

    const milestones = [
        { year: "2024", event: "CyberSafePlay Founded", description: "Started with a vision to make cybersecurity education accessible" },
        { year: "2024", event: "First Game Launch", description: "Released Phishing Detective to positive user feedback" },
        { year: "2024", event: "10K Users", description: "Reached our first major milestone of 10,000 registered users" },
        { year: "2025", event: "Global Expansion", description: "Expanded to serve learners across 25+ countries worldwide" }
    ];

    const features = [
        {
            title: "Gamified Learning",
            description: "Interactive games that make cybersecurity education engaging and memorable",
            icon: Zap,
            color: "text-primary",
            benefits: ["Increased retention", "Hands-on experience", "Progress tracking"]
        },
        {
            title: "Real-world Skills",
            description: "Practical knowledge that translates directly to workplace security challenges",
            icon: Target,
            color: "text-secondary",
            benefits: ["Industry-relevant", "Certification aligned", "Career advancement"]
        },
        {
            title: "Community Driven",
            description: "Learn alongside thousands of cybersecurity enthusiasts worldwide",
            icon: Users,
            color: "text-accent",
            benefits: ["Peer learning", "Expert mentorship", "Global network"]
        },
        {
            title: "Industry Recognition",
            description: "Courses aligned with industry standards and certification requirements",
            icon: Award,
            color: "text-primary",
            benefits: ["CISSP aligned", "CEH preparation", "Industry endorsed"]
        }
    ];

    const team = [
        {
            name: "Aman Mishra",
            role: "Founder & Lead Developer",
            bio: "Cybersecurity enthusiast with certifications. Passionate about making security education accessible through innovative technology and gamified learning experiences.",
            skills: ["React/TypeScript", "Node.js/Python", "Cybersecurity", "Game Design", "EdTech"],
            icon: Code,
            social: {
                github: "https://github.com/AmanMishra107",
                linkedin: "https://linkedin.com/in/amanmishra107",

            }
        }
    ];

    const values = [
        {
            title: "Security First",
            description: "We prioritize user security and privacy in everything we build",
            icon: Shield,
            color: "text-primary"
        },
        {
            title: "Accessible Learning",
            description: "Education should be available to everyone, regardless of background",
            icon: Users,
            color: "text-secondary"
        },
        {
            title: "Innovation",
            description: "We continuously push the boundaries of educational technology",
            icon: Rocket,
            color: "text-accent"
        },
        {
            title: "Community",
            description: "Building a supportive global community of security professionals",
            icon: Heart,
            color: "text-primary"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-card/20">
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



            {/* Hero Section */}
            <div className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <Shield className="h-16 w-16 text-primary animate-glow-pulse" />
                        <Rocket className="h-12 w-12 text-secondary animate-bounce" />
                        <Star className="h-10 w-10 text-accent animate-pulse" />
                    </div>
                    <h1 className="text-5xl font-cyber font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-6">
                        About CyberSafePlay
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
                        Empowering the next generation of cybersecurity professionals through
                        <span className="text-primary font-semibold"> innovative gamified learning</span> that makes
                        complex security concepts accessible, engaging, and practical for real-world application.
                    </p>

                    <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Founded in 2025</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>Navi Mumbai, India</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Coffee className="h-4 w-4" />
                            <span>Fueled by passion</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-20">
                {/* Mission */}
                <Card className="glass-card p-8 mb-12">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <Target className="h-12 w-12 text-secondary animate-pulse" />
                            <TrendingUp className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-cyber font-bold mb-6">Our Mission</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl mx-auto mb-6">
                            To democratize cybersecurity education by creating immersive, interactive experiences
                            that teach real-world security skills. We believe learning should be engaging, practical,
                            and accessible to everyone, regardless of their technical background or geographic location.
                        </p>
                        <div className="flex items-center justify-center space-x-8 text-sm">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">100%</div>
                                <div className="text-muted-foreground">Hands-on Learning</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-secondary">24/7</div>
                                <div className="text-muted-foreground">Available Access</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-accent">0</div>
                                <div className="text-muted-foreground">Boring Lectures</div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <Card key={stat.label} className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300">
                            <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3 animate-pulse`} />
                            <div className="text-3xl font-cyber font-bold text-foreground mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
                            <div className="text-xs text-green-500 flex items-center justify-center space-x-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>{stat.change}</span>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Features */}
                <div className="mb-12">
                    <h2 className="text-3xl font-cyber font-bold text-center mb-8">Why Choose CyberSafePlay?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <Card key={feature.title} className="glass-card p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-3 rounded-lg bg-current/10 flex-shrink-0`}>
                                        <feature.icon className={`h-8 w-8 ${feature.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-cyber font-bold mb-3">{feature.title}</h3>
                                        <p className="text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {feature.benefits.map((benefit, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                                    {benefit}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="mb-12">
                    <h2 className="text-3xl font-cyber font-bold text-center mb-8">Our Journey</h2>
                    <Card className="glass-card p-8">
                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"></div>
                            <div className="space-y-8">
                                {milestones.map((milestone, index) => (
                                    <div key={index} className="flex items-start space-x-6">
                                        <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold relative z-10">
                                            {milestone.year}
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <h3 className="text-lg font-semibold mb-2">{milestone.event}</h3>
                                            <p className="text-muted-foreground">{milestone.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Team */}
                <div className="mb-12">
                    <h2 className="text-3xl font-cyber font-bold text-center mb-8 flex items-center justify-center space-x-3">
                        <Users className="h-8 w-8 text-primary" />
                        <span>Meet the Team</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <Card key={member.name} className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300">
                                <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <member.icon className="h-12 w-12 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                                <p className="text-primary font-medium mb-3">{member.role}</p>
                                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{member.bio}</p>

                                <div className="flex flex-wrap gap-2 justify-center mb-4">
                                    {member.skills.map((skill) => (
                                        <span key={skill} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>


                            </Card>
                        ))}
                    </div>
                </div>

                {/* Values */}
                <div className="mb-12">
                    <h2 className="text-3xl font-cyber font-bold text-center mb-8">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <Card key={value.title} className="glass-card p-6 text-center hover:shadow-lg transition-shadow duration-300">
                                <value.icon className={`h-12 w-12 ${value.color} mx-auto mb-4 animate-pulse`} />
                                <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <Card className="glass-card p-8 text-center">
                    <div className="flex items-center justify-center space-x-3 mb-6">
                        <Heart className="h-12 w-12 text-red-500 animate-pulse" />
                        <Code className="h-10 w-10 text-primary" />
                        <Coffee className="h-8 w-8 text-secondary" />
                    </div>
                    <h2 className="text-3xl font-cyber font-bold mb-6">Built with Passion</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                        CyberSafePlay was born from a passion for cybersecurity education and a belief
                        that learning should be fun, engaging, and effective. Every game, feature,
                        and interaction is crafted with care to provide the best possible learning experience.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="cyber-button">
                            <Rocket className="h-4 w-4 mr-2" />
                            Start Learning Today
                        </Button>
                        <Button variant="outline" className="border-secondary/50 text-secondary hover:bg-secondary/10">
                            <Users className="h-4 w-4 mr-2" />
                            Join Our Community
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default About;
