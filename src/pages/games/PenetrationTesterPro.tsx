import React, { useState, useEffect } from "react";
import GameLayout from "@/components/GameLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Building2,
    Terminal,
    Network,
    Search,
    Shield,
    Bug,
    Key,
    CheckCircle,
    AlertTriangle,
    Eye,
    FileText,
    Clock,
    Target,
    Database,
    Server,
    Wifi,
    Lock,
    HelpCircle,
    Lightbulb,
    Users,
    Mail,
    Globe,
    ChevronDown,
    ChevronUp
} from "lucide-react";

const RealWorldPenTest = () => {
    const [score, setScore] = useState(0);
    const [currentDay, setCurrentDay] = useState(1);
    const [currentPhase, setCurrentPhase] = useState(0);
    const [logs, setLogs] = useState(["[DAY 1] Starting penetration test engagement for ACME Corp..."]);
    const [usedTools, setUsedTools] = useState([]);
    const [discoveries, setDiscoveries] = useState([]);
    const [vulnerabilities, setVulnerabilities] = useState([]);
    const [clientApproval, setClientApproval] = useState(false);
    const [showTutorial, setShowTutorial] = useState(true);
    const [selectedTool, setSelectedTool] = useState(null);
    const [riskScore, setRiskScore] = useState(0);
    const [expandedTool, setExpandedTool] = useState(null);

    // Real-world scenario: ACME Corporation Penetration Test
    const scenario = {
        client: "ACME Corporation",
        industry: "E-commerce & Financial Services",
        scope: "External Web Application, Internal Network, Email Security",
        duration: "5 Days",
        objective: "Identify security vulnerabilities that could lead to data breach or financial loss",
        constraints: [
            "No DoS attacks",
            "Business hours only (9 AM - 6 PM)",
            "Notify immediately if critical vulnerability found",
            "No social engineering of C-level executives"
        ]
    };

    const phases = [
        {
            id: "pre-engagement",
            name: "Pre-Engagement",
            day: 1,
            description: "Scope definition, rules of engagement, and legal agreements",
            beginner_tip: "Always get written permission before starting any security testing!",
            expert_note: "Proper scoping prevents legal issues and ensures comprehensive coverage"
        },
        {
            id: "reconnaissance",
            name: "Reconnaissance & OSINT",
            day: 1,
            description: "Passive information gathering about the target organization",
            beginner_tip: "Start with publicly available information - it's legal and often reveals a lot",
            expert_note: "OSINT can reveal critical infrastructure details and potential attack vectors"
        },
        {
            id: "scanning",
            name: "Active Scanning",
            day: 2,
            description: "Network discovery and vulnerability assessment",
            beginner_tip: "Use stealth scans to avoid detection by security systems",
            expert_note: "Combine multiple scanning techniques for comprehensive coverage"
        },
        {
            id: "exploitation",
            name: "Exploitation",
            day: 3,
            description: "Attempt to exploit discovered vulnerabilities",
            beginner_tip: "Always test in a controlled manner - document everything you do",
            expert_note: "Focus on business impact - demonstrate real risk to the organization"
        },
        {
            id: "post-exploitation",
            name: "Post-Exploitation",
            day: 4,
            description: "Privilege escalation and lateral movement",
            beginner_tip: "Show what an attacker could access, but don't actually access sensitive data",
            expert_note: "Demonstrate the full impact chain - from initial access to critical assets"
        },
        {
            id: "reporting",
            name: "Reporting & Remediation",
            day: 5,
            description: "Document findings and provide actionable recommendations",
            beginner_tip: "Write for both technical teams and business executives",
            expert_note: "Include business risk context and prioritized remediation roadmap"
        }
    ];

    // Comprehensive tool set with realistic scenarios
    const toolSet = {
        "pre-engagement": [
            {
                id: "scope-definition",
                name: "Define Scope & Rules",
                icon: FileText,
                description: "Establish testing boundaries and get written authorization",
                beginner_explanation: "This legal step protects both you and the client. Never skip this!",
                expert_technique: "Use PTES pre-engagement questionnaire for comprehensive scoping",
                results: ["Signed ROE document", "IP ranges defined: 203.0.113.0/24", "Testing window: Mon-Fri 9AM-6PM"],
                points: 25,
                required: true,
                difficulty: "Beginner"
            },
            {
                id: "threat-modeling",
                name: "Threat Modeling",
                icon: Target,
                description: "Identify critical assets and potential attack paths",
                beginner_explanation: "Think like an attacker - what would they want to steal?",
                expert_technique: "Use STRIDE methodology to systematically identify threats",
                results: ["Customer database identified as crown jewel", "Payment processing system mapped", "Admin interfaces documented"],
                points: 35,
                required: false,
                difficulty: "Intermediate"
            }
        ],
        "reconnaissance": [
            {
                id: "osint-gathering",
                name: "OSINT Collection",
                icon: Search,
                description: "Gather publicly available information about the target",
                beginner_explanation: "Use Google, social media, and public records - it's all legal!",
                expert_technique: "Automate with tools like theHarvester, Maltego, and Shodan",
                results: ["25 employee emails found", "Technology stack: Apache, PHP, MySQL", "Subdomains: admin.acme.com, api.acme.com"],
                points: 30,
                required: true,
                difficulty: "Beginner"
            },
            {
                id: "social-media-recon",
                name: "Social Media Intelligence",
                icon: Users,
                description: "Analyze employee social media for sensitive information",
                beginner_explanation: "People often overshare work details on LinkedIn and Twitter",
                expert_technique: "Use OSINT Framework and social media monitoring tools",
                results: ["IT admin posts about new security tools", "CEO travel schedule found", "Office photos reveal network equipment"],
                points: 20,
                required: false,
                difficulty: "Beginner"
            },
            {
                id: "dns-enumeration",
                name: "DNS Enumeration",
                icon: Network,
                description: "Discover subdomains and DNS information",
                beginner_explanation: "DNS records can reveal hidden services and infrastructure",
                expert_technique: "Combine multiple techniques: zone transfers, brute forcing, certificate transparency",
                results: ["Mail servers: mail1.acme.com, mail2.acme.com", "VPN endpoint: vpn.acme.com", "Dev environment: test.acme.com"],
                points: 25,
                required: false,
                difficulty: "Intermediate"
            }
        ],
        "scanning": [
            {
                id: "port-scanning",
                name: "Network Port Scanning",
                icon: Network,
                description: "Identify open ports and running services",
                beginner_explanation: "This shows what services are accessible from the internet",
                expert_technique: "Use Nmap with stealth techniques and script scanning",
                command: "nmap -sS -sV -sC -O 203.0.113.1-254",
                results: ["Port 22 (SSH): OpenSSH 7.4", "Port 80 (HTTP): Apache 2.4.41", "Port 443 (HTTPS): Apache 2.4.41", "Port 3306 (MySQL): Filtered"],
                points: 40,
                required: true,
                difficulty: "Beginner"
            },
            {
                id: "web-scanning",
                name: "Web Application Scanning",
                icon: Globe,
                description: "Scan web applications for common vulnerabilities",
                beginner_explanation: "Web apps are often the easiest way into a network",
                expert_technique: "Use Nikto, dirb, and custom scripts for comprehensive coverage",
                command: "nikto -h https://acme.com",
                results: ["Outdated jQuery library (XSS risk)", "/admin directory found", "Weak SSL configuration detected"],
                points: 45,
                required: true,
                difficulty: "Intermediate"
            }
        ],
        "exploitation": [
            {
                id: "sql-injection",
                name: "SQL Injection Attack",
                icon: Database,
                description: "Test for SQL injection vulnerabilities in web forms",
                beginner_explanation: "SQL injection lets attackers access database information directly",
                expert_technique: "Manual testing combined with SQLMap for automated exploitation",
                command: "sqlmap -u 'http://acme.com/login' --forms --batch",
                results: ["Login bypass successful", "Database version: MySQL 5.7.32", "User table dumped (10,000 records)", "Admin hash cracked: admin123"],
                points: 75,
                required: false,
                difficulty: "Intermediate",
                risk_level: "Critical"
            },
            {
                id: "credential-stuffing",
                name: "Credential Stuffing",
                icon: Key,
                description: "Test for password reuse using common credential lists",
                beginner_explanation: "Many people reuse passwords across multiple sites",
                expert_technique: "Use Hydra with targeted wordlists and rate limiting",
                command: "hydra -L users.txt -P passwords.txt acme.com http-post-form",
                results: ["5 valid credentials found", "admin:password123", "Database access gained"],
                points: 60,
                required: false,
                difficulty: "Intermediate",
                risk_level: "High"
            }
        ],
        "post-exploitation": [
            {
                id: "privilege-escalation",
                name: "Privilege Escalation",
                icon: Shield,
                description: "Escalate from user to administrator privileges",
                beginner_explanation: "Show how an attacker could gain full system control",
                expert_technique: "Use LinPEAS/WinPEAS for automated privilege escalation detection",
                results: ["Kernel exploit available", "Root/Administrator access gained", "All user data accessible"],
                points: 80,
                required: false,
                difficulty: "Advanced",
                risk_level: "Critical"
            }
        ],
        "reporting": [
            {
                id: "executive-summary",
                name: "Executive Summary",
                icon: FileText,
                description: "Create high-level summary for business leadership",
                beginner_explanation: "Executives care about business impact, not technical details",
                expert_technique: "Focus on business risk, compliance implications, and ROI of fixes",
                results: ["Critical risk to customer data identified", "Potential compliance violations noted", "Estimated breach cost: $2.4M"],
                points: 50,
                required: true,
                difficulty: "Intermediate"
            }
        ]
    };

    const getCurrentPhaseTools = () => {
        return toolSet[phases[currentPhase].id] || [];
    };

    const addLog = (message, type = "info") => {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = type === "success" ? "[SUCCESS]" :
            type === "warning" ? "[WARNING]" :
                type === "error" ? "[ERROR]" :
                    "[INFO]";
        setLogs(prev => [...prev, `[${timestamp}] ${prefix} ${message}`]);
    };

    const useTool = (tool) => {
        if (usedTools.includes(tool.id)) {
            addLog(`${tool.name} has already been used in this engagement`, "warning");
            return;
        }

        setSelectedTool(tool);
        addLog(`Executing ${tool.name}...`);

        // Simulate realistic execution time
        setTimeout(() => {
            setUsedTools(prev => [...prev, tool.id]);
            setScore(prev => prev + tool.points);

            // Add discoveries
            tool.results.forEach(result => {
                addLog(result, "success");
                setDiscoveries(prev => [...prev, result]);
            });

            // Handle vulnerabilities
            if (tool.risk_level) {
                setVulnerabilities(prev => [...prev, {
                    name: tool.name,
                    risk: tool.risk_level,
                    description: tool.description,
                    impact: tool.results[0]
                }]);

                const riskPoints = tool.risk_level === "Critical" ? 25 :
                    tool.risk_level === "High" ? 15 : 10;
                setRiskScore(prev => prev + riskPoints);
            }

            // Phase completion check
            checkPhaseCompletion();
        }, 2000);
    };

    const checkPhaseCompletion = () => {
        const phaseTools = getCurrentPhaseTools();
        const requiredTools = phaseTools.filter(tool => tool.required);
        const completedRequired = requiredTools.filter(tool => usedTools.includes(tool.id));

        if (completedRequired.length === requiredTools.length) {
            addLog(`${phases[currentPhase].name} phase requirements completed!`, "success");
        }
    };

    const nextPhase = () => {
        const phaseTools = getCurrentPhaseTools();
        const requiredTools = phaseTools.filter(tool => tool.required);
        const completedRequired = requiredTools.filter(tool => usedTools.includes(tool.id));

        if (completedRequired.length < requiredTools.length) {
            addLog("Complete all required activities before proceeding to next phase", "error");
            return;
        }

        if (currentPhase < phases.length - 1) {
            setCurrentPhase(prev => prev + 1);
            if (phases[currentPhase + 1].day > currentDay) {
                setCurrentDay(phases[currentPhase + 1].day);
                addLog(`--- DAY ${phases[currentPhase + 1].day} ---`);
            }
            addLog(`Starting ${phases[currentPhase + 1].name} phase`);
        }
    };

    const resetEngagement = () => {
        setScore(0);
        setCurrentDay(1);
        setCurrentPhase(0);
        setLogs(["[DAY 1] Starting penetration test engagement for ACME Corp..."]);
        setUsedTools([]);
        setDiscoveries([]);
        setVulnerabilities([]);
        setClientApproval(false);
        setSelectedTool(null);
        setRiskScore(0);
        setExpandedTool(null);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case "Beginner": return "bg-green-500/20 text-green-400";
            case "Intermediate": return "bg-yellow-500/20 text-yellow-400";
            case "Advanced": return "bg-red-500/20 text-red-400";
            default: return "bg-gray-500/20 text-gray-400";
        }
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case "Critical": return "text-red-500";
            case "High": return "text-orange-500";
            case "Medium": return "text-yellow-500";
            case "Low": return "text-blue-500";
            default: return "text-gray-500";
        }
    };

    return (
        <GameLayout title="Real-World Penetration Test" score={score}>
            <div className="w-full max-w-none px-2 sm:px-4 lg:px-6 space-y-4 sm:space-y-6">
                {/* Scenario Overview - Mobile Responsive */}
                {showTutorial && (
                    <Card className="glass-card p-4 sm:p-6 border-primary/20">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <h2 className="text-xl sm:text-2xl font-cyber font-bold text-primary flex items-center space-x-2">
                                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                                    <span>Engagement Overview</span>
                                </h2>
                                <Button onClick={() => setShowTutorial(false)} size="sm" className="shrink-0">
                                    Start Engagement
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <h3 className="font-semibold text-secondary mb-2">Client Information</h3>
                                    <div className="space-y-1 text-sm">
                                        <div><span className="text-muted-foreground">Company:</span> {scenario.client}</div>
                                        <div><span className="text-muted-foreground">Industry:</span> {scenario.industry}</div>
                                        <div><span className="text-muted-foreground">Duration:</span> {scenario.duration}</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-accent mb-2">Test Scope</h3>
                                    <div className="text-sm">
                                        <div className="text-muted-foreground mb-1">Objective:</div>
                                        <div className="break-words">{scenario.objective}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-primary mb-2">Rules of Engagement</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {scenario.constraints.map((constraint, index) => (
                                        <div key={index} className="flex items-start space-x-2 text-sm">
                                            <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 shrink-0" />
                                            <span className="break-words">{constraint}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Status Dashboard - Fully Responsive */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    <Card className="glass-card p-3 sm:p-4 text-center">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />
                        <div className="text-base sm:text-lg font-cyber font-bold text-primary">Day {currentDay}</div>
                        <div className="text-xs text-muted-foreground">of 5</div>
                    </Card>
                    <Card className="glass-card p-3 sm:p-4 text-center">
                        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-secondary mx-auto mb-2" />
                        <div className="text-base sm:text-lg font-cyber font-bold text-secondary">{discoveries.length}</div>
                        <div className="text-xs text-muted-foreground">Discoveries</div>
                    </Card>
                    <Card className="glass-card p-3 sm:p-4 text-center">
                        <Bug className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mx-auto mb-2" />
                        <div className="text-base sm:text-lg font-cyber font-bold text-red-500">{vulnerabilities.length}</div>
                        <div className="text-xs text-muted-foreground">Vulnerabilities</div>
                    </Card>
                    <Card className="glass-card p-3 sm:p-4 text-center">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-accent mx-auto mb-2" />
                        <div className="text-base sm:text-lg font-cyber font-bold text-accent">{riskScore}</div>
                        <div className="text-xs text-muted-foreground">Risk Score</div>
                    </Card>
                    <Card className="glass-card p-3 sm:p-4 text-center col-span-2 sm:col-span-1">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mx-auto mb-2" />
                        <div className="text-base sm:text-lg font-cyber font-bold text-green-500">{score}</div>
                        <div className="text-xs text-muted-foreground">Total Score</div>
                    </Card>
                </div>

                {/* Current Phase - Mobile Optimized */}
                <Card className="glass-card p-4 sm:p-6">
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h3 className="text-xl sm:text-2xl font-cyber font-bold break-words">
                                {phases[currentPhase].name}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <Badge className="bg-primary/20 text-primary">
                                    Day {phases[currentPhase].day}
                                </Badge>
                                <Button onClick={nextPhase} className="cyber-button text-sm">
                                    {currentPhase < phases.length - 1 ? "Next Phase" : "Complete"}
                                </Button>
                            </div>
                        </div>

                        <p className="text-muted-foreground text-sm sm:text-base break-words">{phases[currentPhase].description}</p>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-start space-x-3 p-3 bg-blue-500/10 rounded-lg">
                                <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mt-0.5 shrink-0" />
                                <div>
                                    <div className="font-semibold text-blue-400 text-xs sm:text-sm">Beginner Tip</div>
                                    <div className="text-xs sm:text-sm text-muted-foreground break-words">{phases[currentPhase].beginner_tip}</div>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-purple-500/10 rounded-lg">
                                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 mt-0.5 shrink-0" />
                                <div>
                                    <div className="font-semibold text-purple-400 text-xs sm:text-sm">Expert Note</div>
                                    <div className="text-xs sm:text-sm text-muted-foreground break-words">{phases[currentPhase].expert_note}</div>
                                </div>
                            </div>
                        </div>

                        {/* Phase Progress */}
                        <div className="flex space-x-1 sm:space-x-2">
                            {phases.map((phase, index) => (
                                <div
                                    key={phase.id}
                                    className={`flex-1 h-2 rounded ${index < currentPhase ? 'bg-green-500' :
                                            index === currentPhase ? 'bg-primary' :
                                                'bg-muted'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Main Content - Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    {/* Tools & Activities - Expandable on Mobile */}
                    <div className="lg:col-span-1 order-1 lg:order-none">
                        <Card className="glass-card p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-cyber font-bold mb-4">Available Activities</h3>
                            <div className="space-y-3">
                                {getCurrentPhaseTools().map(tool => (
                                    <div key={tool.id} className="border border-muted/20 rounded-lg overflow-hidden">
                                        <Button
                                            onClick={() => {
                                                if (expandedTool === tool.id) {
                                                    useTool(tool);
                                                } else {
                                                    setExpandedTool(expandedTool === tool.id ? null : tool.id);
                                                }
                                            }}
                                            disabled={usedTools.includes(tool.id)}
                                            className={`w-full justify-between p-3 h-auto text-left ${usedTools.includes(tool.id)
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'cyber-button'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                <tool.icon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <span className="font-semibold text-sm sm:text-base truncate">{tool.name}</span>
                                                        <div className="flex space-x-1 shrink-0">
                                                            <Badge className={`${getDifficultyColor(tool.difficulty)} text-xs`}>
                                                                {tool.difficulty}
                                                            </Badge>
                                                            {tool.required && (
                                                                <Badge className="bg-red-500/20 text-red-400 text-xs">
                                                                    Required
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs opacity-70 line-clamp-2">{tool.description}</div>
                                                </div>
                                            </div>
                                            <div className="ml-2 flex items-center space-x-2 shrink-0">
                                                {usedTools.includes(tool.id) ? (
                                                    <CheckCircle className="h-4 w-4" />
                                                ) : (
                                                    expandedTool === tool.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                                )}
                                            </div>
                                        </Button>

                                        {/* Expanded Details */}
                                        {expandedTool === tool.id && !usedTools.includes(tool.id) && (
                                            <div className="p-4 bg-muted/10 border-t space-y-3">
                                                <div className="text-xs text-blue-400 break-words">
                                                    💡 <span className="font-medium">Beginner:</span> {tool.beginner_explanation}
                                                </div>
                                                <div className="text-xs text-purple-400 break-words">
                                                    🎯 <span className="font-medium">Expert:</span> {tool.expert_technique}
                                                </div>
                                                {tool.command && (
                                                    <div className="text-xs font-mono bg-black/20 p-2 rounded break-all">
                                                        {tool.command}
                                                    </div>
                                                )}
                                                <Button
                                                    onClick={() => useTool(tool)}
                                                    className="w-full text-sm cyber-button"
                                                >
                                                    Execute {tool.name}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Button onClick={resetEngagement} variant="outline" className="w-full mt-6 text-sm">
                                Reset Engagement
                            </Button>
                        </Card>
                    </div>

                    {/* Engagement Log - Mobile Optimized */}
                    <div className="lg:col-span-1 order-3 lg:order-none">
                        <Card className="glass-card p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-cyber font-bold mb-4 flex items-center space-x-2">
                                <Terminal className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                                <span>Engagement Log</span>
                            </h3>

                            <div className="bg-black rounded-lg p-3 sm:p-4 h-64 sm:h-80 lg:h-96 overflow-y-auto font-mono text-xs sm:text-sm">
                                {logs.map((log, index) => (
                                    <div
                                        key={index}
                                        className={`mb-1 break-words ${log.includes('[SUCCESS]') ? 'text-green-400' :
                                                log.includes('[WARNING]') ? 'text-yellow-400' :
                                                    log.includes('[ERROR]') ? 'text-red-400' :
                                                        log.includes('DAY') ? 'text-cyan-400 font-bold' :
                                                            'text-white'
                                            }`}
                                    >
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Findings & Intelligence - Scrollable on Mobile */}
                    <div className="lg:col-span-1 order-2 lg:order-none">
                        <Card className="glass-card p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-cyber font-bold mb-4">Findings Summary</h3>

                            <div className="space-y-4 max-h-96 lg:max-h-none overflow-y-auto lg:overflow-visible">
                                <div>
                                    <h4 className="font-semibold text-red-400 mb-2 flex items-center space-x-2 text-sm">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span>Security Vulnerabilities ({vulnerabilities.length})</span>
                                    </h4>
                                    {vulnerabilities.length > 0 ? (
                                        <div className="space-y-2">
                                            {vulnerabilities.map((vuln, index) => (
                                                <div key={index} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                    <div className="flex items-center justify-between mb-1 gap-2">
                                                        <span className="font-semibold text-xs sm:text-sm break-words">{vuln.name}</span>
                                                        <Badge className={`text-xs ${getRiskColor(vuln.risk)} shrink-0`}>
                                                            {vuln.risk} Risk
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground break-words">{vuln.description}</p>
                                                    <p className="text-xs text-red-400 mt-1 break-words">Impact: {vuln.impact}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-muted-foreground text-sm">No vulnerabilities discovered yet</div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="font-semibold text-blue-400 mb-2 flex items-center space-x-2 text-sm">
                                        <Eye className="h-4 w-4" />
                                        <span>Intelligence Gathered ({discoveries.length})</span>
                                    </h4>
                                    <div className="space-y-1 max-h-32 overflow-y-auto">
                                        {discoveries.slice(-10).map((discovery, index) => (
                                            <div key={index} className="text-xs p-2 bg-blue-500/10 rounded break-words">
                                                {discovery}
                                            </div>
                                        ))}
                                        {discoveries.length === 0 && (
                                            <div className="text-muted-foreground text-sm">No intelligence gathered yet</div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-primary mb-2 text-sm">Engagement Progress</h4>
                                    <div className="text-sm space-y-1">
                                        <div className="flex justify-between">
                                            <span>Activities Completed:</span>
                                            <span>{usedTools.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Current Phase:</span>
                                            <span>{currentPhase + 1}/{phases.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Risk Score:</span>
                                            <span className={getRiskColor(riskScore > 50 ? "Critical" : riskScore > 25 ? "High" : "Medium")}>
                                                {riskScore}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </GameLayout>
    );
};

export default RealWorldPenTest;
