import React, { useState, useEffect, useCallback } from "react";
import GameLayout from "@/components/GameLayout";
import { FileText, Search, Calendar, Users, Globe, HardDrive, Mail, Terminal, CheckCircle, AlertTriangle, Clock, Target, Eye, Database, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Evidence {
    id: number;
    name: string;
    type: 'email' | 'file' | 'log' | 'image' | 'network' | 'registry' | 'database';
    category: 'communication' | 'system' | 'network' | 'user_activity' | 'malware';
    content: string;
    metadata: {
        timestamp?: string;
        source?: string;
        hash?: string;
        size?: string;
        location?: string;
    };
    analyzed: boolean;
    clues: string[];
    redHerrings: string[];
    icon: any;
}

interface Question {
    id: number;
    question: string;
    type: 'multiple_choice' | 'text_input' | 'timeline' | 'analysis';
    options?: string[];
    correctAnswer: string;
    explanation: string;
    points: number;
    evidenceIds: number[];
    answered: boolean;
    userAnswer?: string;
    isCorrect?: boolean;
}

interface CaseFile {
    title: string;
    description: string;
    scenario: string;
    objective: string;
    timeline: string[];
    suspects: string[];
}

const forensicCase: CaseFile = {
    title: "Operation Dark Phoenix",
    description: "Corporate data breach with insider threat indicators",
    scenario: "TechCorp Inc. suffered a major data breach where customer databases were exfiltrated and sold on the dark web. Initial investigation suggests insider involvement. Your task is to analyze the digital evidence and identify the perpetrator.",
    objective: "Determine who initiated the breach, when it occurred, what data was compromised, and how the attack was executed.",
    timeline: [
        "2024-01-15: Unusual network activity detected",
        "2024-01-16: Database access logs show anomalies",
        "2024-01-17: Customer data appears on dark web",
        "2024-01-18: Investigation initiated"
    ],
    suspects: [
        "Sarah Chen - Database Administrator",
        "Mike Rodriguez - IT Security Analyst",
        "Jennifer Park - Software Developer",
        "David Kim - System Administrator"
    ]
};

const evidenceDatabase: Evidence[] = [
    {
        id: 1,
        name: "Email Thread - Database Maintenance",
        type: 'email',
        category: 'communication',
        content: `From: sarah.chen@techcorp.com
To: mike.rodriguez@techcorp.com
Date: 2024-01-14 23:45:12
Subject: Urgent DB Maintenance Required

Mike,

I need to perform emergency maintenance on the customer database tonight. There's a critical issue with the indexing that could cause data corruption. I'll need elevated access to fix this.

Please approve my temporary admin privileges ASAP. I'll work through the night to resolve this.

Thanks,
Sarah

---

From: mike.rodriguez@techcorp.com  
To: sarah.chen@techcorp.com
Date: 2024-01-14 23:52:33
Subject: RE: Urgent DB Maintenance Required

Sarah,

This seems unusual for a Sunday night. Can this wait until Monday morning when we can coordinate properly? What specific indexing issue are you referring to?

Mike`,
        metadata: {
            timestamp: "2024-01-14 23:45:12",
            source: "Exchange Server",
            size: "2.3KB"
        },
        analyzed: false,
        clues: ["Late night maintenance request", "Request for elevated privileges", "Urgency without proper documentation"],
        redHerrings: ["Sunday timing might be normal for maintenance"],
        icon: Mail
    },
    {
        id: 2,
        name: "Database Access Log",
        type: 'log',
        category: 'system',
        content: `[2024-01-15 02:15:43] LOGIN_SUCCESS: User=sarah.chen, Database=CustomerDB, Privilege=ADMIN
[2024-01-15 02:16:12] QUERY_EXECUTE: SELECT * FROM customers WHERE created_date > '2023-01-01'
[2024-01-15 02:16:45] QUERY_EXECUTE: SELECT customer_id, email, phone, ssn FROM customers
[2024-01-15 02:17:23] BULK_EXPORT: Table=customers, Rows=150000, Format=CSV, Destination=temp_backup.csv
[2024-01-15 02:18:56] FILE_COPY: temp_backup.csv -> D:\\exports\\customer_data_20240115.csv
[2024-01-15 02:19:34] LOGIN_SUCCESS: User=system_backup, Database=CustomerDB, Privilege=READ
[2024-01-15 02:20:12] QUERY_EXECUTE: SELECT COUNT(*) FROM customers
[2024-01-15 02:21:45] LOGOUT: User=sarah.chen
[2024-01-15 02:22:03] FILE_DELETE: temp_backup.csv`,
        metadata: {
            timestamp: "2024-01-15 02:15:43 - 02:22:03",
            source: "PostgreSQL Audit Log",
            location: "/var/log/postgresql/audit.log"
        },
        analyzed: false,
        clues: ["Complete customer table export", "Suspicious query patterns", "File copied to external location"],
        redHerrings: ["system_backup user activity might be normal"],
        icon: Database
    },
    {
        id: 3,
        name: "Network Traffic Analysis",
        type: 'network',
        category: 'network',
        content: `Timestamp: 2024-01-15 02:25:17
Source IP: 192.168.1.45 (Sarah's Workstation)
Destination IP: 185.220.101.23 (Tor Exit Node)
Protocol: HTTPS
Port: 443
Data Size: 45.2MB
Duration: 23 minutes

Connection Details:
- Multiple encrypted data streams
- Fragmented transmission pattern
- Non-standard user agent: "DataTransfer/1.0"
- Certificate authority: Let's Encrypt (suspicious for corporate transfer)

Subsequent Connections:
02:51:33 - Connection to 195.123.45.67 (Known marketplace server)
02:52:45 - Bitcoin transaction detected: 0.15 BTC received
03:15:22 - VPN connection established to Netherlands server`,
        metadata: {
            timestamp: "2024-01-15 02:25:17",
            source: "Firewall Logs & Wireshark Capture",
            size: "45.2MB transferred"
        },
        analyzed: false,
        clues: ["Large data transfer via Tor", "Connection to dark web marketplace", "Bitcoin payment received"],
        redHerrings: ["VPN usage might be legitimate for remote work"],
        icon: Globe
    },
    {
        id: 4,
        name: "USB Device Log",
        type: 'log',
        category: 'user_activity',
        content: `Windows USB Device Activity Log

[2024-01-15 01:45:23] USB Device Connected
Device: SanDisk Ultra 64GB (Serial: 4C530001041022115213)
Drive Letter: E:
User: sarah.chen
Computer: TECHCORP-WS-045

[2024-01-15 01:46:45] File System Activity
Action: CREATE_FILE
Path: E:\\customer_backup_jan2024.csv
Size: 47,234,567 bytes
User: sarah.chen

[2024-01-15 01:47:12] File System Activity  
Action: CREATE_FILE
Path: E:\\contact_list.txt
Size: 125,445 bytes
User: sarah.chen

[2024-01-15 02:23:56] USB Device Disconnected
Device: SanDisk Ultra 64GB
Duration Connected: 38 minutes`,
        metadata: {
            timestamp: "2024-01-15 01:45:23",
            source: "Windows Event Log",
            location: "System32/winevt/Logs/Security.evtx"
        },
        analyzed: false,
        clues: ["USB device used for data storage", "Large file copied to external drive", "Timing correlates with database export"],
        redHerrings: ["Could be legitimate backup procedure"],
        icon: HardDrive
    },
    {
        id: 5,
        name: "Browser History Fragment",
        type: 'file',
        category: 'user_activity',
        content: `Recovered Browser History (Firefox - sarah.chen)
Note: Significant portions deleted, partial recovery only

2024-01-12 14:23:15 - google.com/search?q=how+to+anonymize+database+exports
2024-01-12 14:45:32 - reddit.com/r/privacy - "Best practices for data anonymization"
2024-01-13 16:12:44 - tor-project.org/download/
2024-01-13 16:18:23 - [DELETED ENTRY - Timestamp only]
2024-01-14 09:33:21 - github.com/search?q=database+export+scripts
2024-01-14 19:45:12 - [DELETED ENTRY - Timestamp only]
2024-01-14 22:15:33 - darkweblinks.guide [DOMAIN ACCESSED]
2024-01-15 01:33:44 - [DELETED ENTRY - Timestamp only]

Cache Analysis:
- 47 entries deleted using specialized software
- CCleaner Professional used at 2024-01-15 03:30:12
- Browsing artifacts suggest cryptocurrency-related activity`,
        metadata: {
            timestamp: "2024-01-12 to 2024-01-15",
            source: "Firefox Profile Recovery",
            hash: "md5:a1b2c3d4e5f6789..."
        },
        analyzed: false,
        clues: ["Research on data anonymization", "Tor browser download", "Dark web access", "Evidence tampering"],
        redHerrings: ["Privacy research could be legitimate security practice"],
        icon: Globe
    },
    {
        id: 6,
        name: "Financial Transaction Record",
        type: 'file',
        category: 'user_activity',
        content: `Blockchain Transaction Analysis
Bitcoin Address: 1A2B3C4D5E6F7G8H9I0J...

Incoming Transaction:
Date: 2024-01-15 02:52:45 UTC
Amount: 0.15 BTC (~$6,750)
From Address: 3K9L2M4N5P6Q7R8S9T0U... (Known marketplace wallet)
Transaction ID: abc123def456ghi789...

Subsequent Activity:
02:55:12 - 0.05 BTC sent to mixer service
02:57:33 - 0.10 BTC sent to exchange (Binance)
03:15:44 - Exchange account linked to email: temp.user.2024@protonmail.com

Bank Account Analysis:
- $6,200 cash deposit at ATM (2024-01-16 14:23:11)
- Location: Downtown Branch, 2 blocks from TechCorp office
- Deposit slip shows handling by Sarah Chen (signature match: 94%)`,
        metadata: {
            timestamp: "2024-01-15 02:52:45",
            source: "Blockchain Explorer & Bank Records",
            location: "Cryptocurrency Investigation Unit"
        },
        analyzed: false,
        clues: ["Payment for stolen data", "Money laundering through mixer", "Cash deposit near workplace"],
        redHerrings: ["Bitcoin transactions could have legitimate explanations"],
        icon: Target
    }
];

const investigationQuestions: Question[] = [
    {
        id: 1,
        question: "Based on the database access logs, what was the primary method used to exfiltrate customer data?",
        type: 'multiple_choice',
        options: [
            "Direct database query and bulk export to CSV file",
            "Incremental backup using automated scripts",
            "API endpoint exploitation with automated tools",
            "SQL injection attack through web application"
        ],
        correctAnswer: "Direct database query and bulk export to CSV file",
        explanation: "The database access log shows clear evidence of direct queries (SELECT * FROM customers, SELECT customer_id, email, phone, ssn FROM customers) followed by a BULK_EXPORT operation that exported 150,000 customer records to a CSV file. This is the most direct method of data exfiltration shown in the evidence.",
        points: 25,
        evidenceIds: [2],
        answered: false
    },
    {
        id: 2,
        question: "What is the most suspicious aspect of the initial email request for database maintenance?",
        type: 'multiple_choice',
        options: [
            "The request was made on a Sunday night",
            "The urgency without proper documentation or change management process",
            "The request came from a database administrator",
            "The mention of indexing issues"
        ],
        correctAnswer: "The urgency without proper documentation or change management process",
        explanation: "While the Sunday timing is unusual, the most concerning red flag is the urgent request for elevated privileges without following proper change management procedures. The request lacks specific technical details and bypasses normal approval processes, which is a common social engineering tactic.",
        points: 20,
        evidenceIds: [1],
        answered: false
    },
    {
        id: 3,
        question: "Analyze the timeline: In what order did the key events occur?",
        type: 'timeline',
        options: [
            "Email request → Database export → Tor transfer → Bitcoin payment",
            "Database export → Email request → Bitcoin payment → Tor transfer",
            "Bitcoin payment → Email request → Database export → Tor transfer",
            "Email request → Bitcoin payment → Database export → Tor transfer"
        ],
        correctAnswer: "Email request → Database export → Tor transfer → Bitcoin payment",
        explanation: "The chronological order is: 1) Email request (Jan 14, 23:45), 2) Database export (Jan 15, 02:16-02:22), 3) Tor data transfer (Jan 15, 02:25), 4) Bitcoin payment received (Jan 15, 02:52). This sequence shows premeditation followed by execution and payment.",
        points: 30,
        evidenceIds: [1, 2, 3, 6],
        answered: false
    },
    {
        id: 4,
        question: "What evidence suggests the perpetrator attempted to cover their tracks?",
        type: 'text_input',
        correctAnswer: "browser history deletion, ccleaner usage, file deletion, tor usage",
        explanation: "Multiple anti-forensic techniques were employed: deleted browser history entries (47 deleted), CCleaner Professional used to wipe artifacts, temporary database files deleted, and Tor network used for anonymous data transfer. These actions demonstrate consciousness of guilt and sophisticated attempt to avoid detection.",
        points: 35,
        evidenceIds: [2, 5],
        answered: false
    },
    {
        id: 5,
        question: "Based on all evidence, who is the most likely perpetrator and what was their motive?",
        type: 'analysis',
        correctAnswer: "sarah chen financial gain",
        explanation: "Sarah Chen is the perpetrator with financial gain as the motive. Evidence: she sent the initial email requesting access, her user account performed the database export, her workstation was used for Tor transfers, and she received Bitcoin payment. The bank deposit with 94% signature match confirms she converted the cryptocurrency to cash. All evidence points to her as an insider threat motivated by financial gain.",
        points: 40,
        evidenceIds: [1, 2, 3, 4, 5, 6],
        answered: false
    }
];

const DigitalForensicsLab = () => {
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
    const [currentPhase, setCurrentPhase] = useState<'briefing' | 'analysis' | 'questioning' | 'report'>('briefing');

    const [evidence, setEvidence] = useState<Evidence[]>(evidenceDatabase);
    const [questions, setQuestions] = useState<Question[]>(investigationQuestions);
    const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
    const [showEvidenceModal, setShowEvidenceModal] = useState(false);
    const [analysisNotes, setAnalysisNotes] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
    const [finalReport, setFinalReport] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);

    // Timer
    useEffect(() => {
        if (gameStarted && !gameCompleted && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !gameCompleted) {
            completeInvestigation();
        }
    }, [timeLeft, gameStarted, gameCompleted]);

    const startInvestigation = () => {
        setGameStarted(true);
        setGameCompleted(false);
        setScore(0);
        setTimeLeft(900);
        setCurrentPhase('briefing');
        setEvidence(evidenceDatabase.map(e => ({ ...e, analyzed: false })));
        setQuestions(investigationQuestions.map(q => ({ ...q, answered: false })));
        setSelectedEvidence(null);
        setAnalysisNotes('');
        setCurrentQuestion(0);
        setUserAnswers({});
        setFinalReport('');
        setShowFeedback(false);
        toast.info("Investigation initiated. Review the case briefing carefully.");
    };

    const analyzeEvidence = (evidenceItem: Evidence) => {
        if (evidenceItem.analyzed) {
            toast.info("Evidence already analyzed. Reviewing findings...");
        } else {
            toast.success(`Evidence analyzed: ${evidenceItem.name}`);
            setScore(prev => prev + 15);
        }

        setEvidence(prev => prev.map(e =>
            e.id === evidenceItem.id ? { ...e, analyzed: true } : e
        ));

        setSelectedEvidence(evidenceItem);
        setShowEvidenceModal(true);
    };

    const submitAnswer = (questionId: number, answer: string) => {
        const question = questions.find(q => q.id === questionId);
        if (!question) return;

        const normalizedAnswer = answer.toLowerCase().trim();
        const normalizedCorrect = question.correctAnswer.toLowerCase().trim();

        let isCorrect = false;
        if (question.type === 'text_input' || question.type === 'analysis') {
            // For text inputs, check if key words are present
            const keyWords = normalizedCorrect.split(' ');
            const matchedWords = keyWords.filter(word => normalizedAnswer.includes(word));
            isCorrect = matchedWords.length >= Math.ceil(keyWords.length * 0.6); // 60% match required
        } else {
            isCorrect = normalizedAnswer === normalizedCorrect;
        }

        const points = isCorrect ? question.points : Math.floor(question.points * 0.3);
        setScore(prev => prev + points);

        setQuestions(prev => prev.map(q =>
            q.id === questionId
                ? { ...q, answered: true, userAnswer: answer, isCorrect: isCorrect }
                : q
        ));

        setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
        setShowFeedback(true);

        if (isCorrect) {
            toast.success(`Correct! +${points} points`);
        } else {
            toast.error(`Incorrect. +${points} points for partial credit`);
        }
    };

    const nextQuestion = () => {
        setShowFeedback(false);
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setCurrentPhase('report');
        }
    };

    const submitFinalReport = () => {
        if (!finalReport.trim()) {
            toast.error("Please complete your final report");
            return;
        }

        const reportScore = Math.min(100, finalReport.length * 0.1);
        const analysisBonus = evidence.filter(e => e.analyzed).length * 10;
        const timeBonus = timeLeft > 300 ? 50 : timeLeft > 150 ? 25 : 0;

        const finalScore = score + reportScore + analysisBonus + timeBonus;
        setScore(finalScore);

        toast.success(`Investigation complete! Final score: ${finalScore}`);
        completeInvestigation();
    };

    const completeInvestigation = () => {
        setGameCompleted(true);
    };

    const resetInvestigation = () => {
        setGameStarted(false);
        setGameCompleted(false);
        setScore(0);
        setTimeLeft(900);
        setCurrentPhase('briefing');
        setEvidence(evidenceDatabase.map(e => ({ ...e, analyzed: false })));
        setQuestions(investigationQuestions.map(q => ({ ...q, answered: false })));
        setSelectedEvidence(null);
        setShowEvidenceModal(false);
        setAnalysisNotes('');
        setCurrentQuestion(0);
        setUserAnswers({});
        setFinalReport('');
        setShowFeedback(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getEvidenceIcon = (type: string) => {
        switch (type) {
            case 'email': return Mail;
            case 'log': return Terminal;
            case 'network': return Globe;
            case 'file': return FileText;
            case 'database': return Database;
            default: return FileText;
        }
    };

    const analyzedCount = evidence.filter(e => e.analyzed).length;
    const answeredCount = questions.filter(q => q.answered).length;

    return (
        <GameLayout title="Digital Forensics Lab" score={score}>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center">
                    <FileText className="w-16 h-16 text-accent mx-auto mb-4" />
                    <h2 className="text-3xl font-cyber font-bold mb-2 text-accent">Digital Forensics Investigation</h2>
                    <p className="text-muted-foreground text-lg max-w-4xl mx-auto mb-6">
                        Conduct a professional forensic analysis to solve a complex cybercrime. Examine digital evidence, analyze attack patterns, and build a comprehensive case.
                    </p>
                </div>

                {/* Game Status */}
                {gameStarted && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <Card className="glass-card p-3 text-center">
                            <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                            <div className={`text-sm font-cyber font-bold ${timeLeft < 180 ? 'text-destructive' : 'text-primary'}`}>
                                {formatTime(timeLeft)}
                            </div>
                            <div className="text-xs text-muted-foreground">Time Left</div>
                        </Card>
                        <Card className="glass-card p-3 text-center">
                            <FileText className="h-5 w-5 text-accent mx-auto mb-1" />
                            <div className="text-sm font-cyber font-bold text-accent">{analyzedCount}/{evidence.length}</div>
                            <div className="text-xs text-muted-foreground">Evidence</div>
                        </Card>
                        <Card className="glass-card p-3 text-center">
                            <Target className="h-5 w-5 text-secondary mx-auto mb-1" />
                            <div className="text-sm font-cyber font-bold text-secondary">{answeredCount}/{questions.length}</div>
                            <div className="text-xs text-muted-foreground">Questions</div>
                        </Card>
                        <Card className="glass-card p-3 text-center">
                            <div className="text-sm font-cyber font-bold text-primary">{currentPhase.toUpperCase()}</div>
                            <div className="text-xs text-muted-foreground">Phase</div>
                        </Card>
                        <Card className="glass-card p-3 text-center">
                            <div className="text-sm font-cyber font-bold text-accent">{score}</div>
                            <div className="text-xs text-muted-foreground">Score</div>
                        </Card>
                    </div>
                )}

                {/* Case Briefing */}
                {gameStarted && currentPhase === 'briefing' && (
                    <Card className="glass-card p-6">
                        <h3 className="text-2xl font-cyber font-bold text-accent mb-4">{forensicCase.title}</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-primary mb-2">Case Overview</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{forensicCase.scenario}</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-primary mb-2">Investigation Objective</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{forensicCase.objective}</p>
                                </div>

                                <Button
                                    onClick={() => setCurrentPhase('analysis')}
                                    className="cyber-button w-full"
                                >
                                    Begin Evidence Analysis
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-primary mb-2">Timeline of Events</h4>
                                    <div className="space-y-2">
                                        {forensicCase.timeline.map((event, index) => (
                                            <div key={index} className="text-sm bg-card/50 p-2 rounded">
                                                {event}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-primary mb-2">Suspects</h4>
                                    <div className="space-y-1">
                                        {forensicCase.suspects.map((suspect, index) => (
                                            <div key={index} className="text-sm text-muted-foreground">
                                                • {suspect}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Evidence Analysis */}
                {gameStarted && currentPhase === 'analysis' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card className="glass-card p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-cyber font-bold text-accent">Digital Evidence</h3>
                                    <Button
                                        onClick={() => setCurrentPhase('questioning')}
                                        className="cyber-button"
                                        disabled={analyzedCount < 3}
                                    >
                                        Proceed to Analysis ({analyzedCount}/3 minimum)
                                    </Button>
                                </div>

                                <div className="grid gap-4">
                                    {evidence.map((item) => {
                                        const IconComponent = getEvidenceIcon(item.type);
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => analyzeEvidence(item)}
                                                className={`p-4 rounded-lg cursor-pointer transition-all border ${item.analyzed
                                                        ? 'border-secondary bg-secondary/10'
                                                        : 'border-muted bg-card/50 hover:border-accent/50'
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <IconComponent className={`h-5 w-5 ${item.analyzed ? 'text-secondary' : 'text-accent'}`} />
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-sm">{item.name}</h4>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <Badge variant="outline" className="text-xs">{item.type}</Badge>
                                                            <Badge variant="outline" className="text-xs">{item.category}</Badge>
                                                            {item.analyzed && <CheckCircle className="h-4 w-4 text-secondary" />}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {item.metadata.timestamp && `Timestamp: ${item.metadata.timestamp}`}
                                                    {item.metadata.source && ` | Source: ${item.metadata.source}`}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>

                        <div>
                            <Card className="glass-card p-4">
                                <h3 className="font-cyber font-bold text-primary mb-4">Analysis Notes</h3>
                                <Textarea
                                    value={analysisNotes}
                                    onChange={(e) => setAnalysisNotes(e.target.value)}
                                    placeholder="Record your observations and findings as you analyze the evidence..."
                                    rows={12}
                                    className="bg-card/50 border-primary/20 resize-none text-sm"
                                />
                            </Card>
                        </div>
                    </div>
                )}

                {/* Investigation Questions */}
                {gameStarted && currentPhase === 'questioning' && (
                    <Card className="glass-card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-cyber font-bold text-accent">Investigation Questions</h3>
                            <div className="text-sm text-muted-foreground">
                                Question {currentQuestion + 1} of {questions.length}
                            </div>
                        </div>

                        {questions[currentQuestion] && (
                            <QuestionComponent
                                question={questions[currentQuestion]}
                                evidence={evidence}
                                onSubmit={submitAnswer}
                                onNext={nextQuestion}
                                userAnswer={userAnswers[questions[currentQuestion].id]}
                                showFeedback={showFeedback}
                            />
                        )}
                    </Card>
                )}

                {/* Final Report */}
                {gameStarted && currentPhase === 'report' && (
                    <Card className="glass-card p-6">
                        <h3 className="text-2xl font-cyber font-bold text-accent mb-4">Final Investigation Report</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-primary mb-2">Executive Summary</h4>
                                    <Textarea
                                        value={finalReport}
                                        onChange={(e) => setFinalReport(e.target.value)}
                                        placeholder="Provide a comprehensive summary of your findings including: Who committed the crime, when it occurred, how it was executed, what evidence supports your conclusion, and recommended actions..."
                                        rows={10}
                                        className="bg-card/50 border-primary/20 resize-none"
                                    />
                                </div>

                                <Button onClick={submitFinalReport} className="cyber-button w-full">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Submit Final Report
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-primary mb-2">Investigation Summary</h4>
                                    <div className="bg-card/50 p-4 rounded border border-primary/20 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Evidence Analyzed:</span>
                                            <span className="text-accent">{analyzedCount}/{evidence.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Questions Answered:</span>
                                            <span className="text-secondary">{answeredCount}/{questions.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Correct Answers:</span>
                                            <span className="text-primary">{questions.filter(q => q.isCorrect).length}/{questions.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Current Score:</span>
                                            <span className="text-primary">{score}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Time Used:</span>
                                            <span className="text-accent">{formatTime(900 - timeLeft)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-primary mb-2">Key Findings</h4>
                                    <div className="bg-card/50 p-4 rounded border border-primary/20 max-h-48 overflow-y-auto text-sm">
                                        {evidence.filter(e => e.analyzed).map((item, index) => (
                                            <div key={index} className="mb-2">
                                                <strong>{item.name}:</strong> {item.clues.join(', ')}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Evidence Modal */}
                {showEvidenceModal && selectedEvidence && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <Card className="glass-card p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-cyber font-bold text-accent">{selectedEvidence.name}</h3>
                                <Button
                                    onClick={() => setShowEvidenceModal(false)}
                                    variant="outline"
                                    size="sm"
                                >
                                    Close
                                </Button>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <h4 className="font-semibold text-primary mb-2">Evidence Content</h4>
                                    <div className="bg-card/70 p-4 rounded border border-accent/20 font-mono text-xs whitespace-pre-wrap max-h-96 overflow-y-auto">
                                        {selectedEvidence.content}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-primary mb-2">Metadata</h4>
                                        <div className="bg-card/50 p-3 rounded text-sm space-y-1">
                                            {Object.entries(selectedEvidence.metadata).map(([key, value]) => (
                                                <div key={key} className="flex justify-between">
                                                    <span className="text-muted-foreground">{key}:</span>
                                                    <span>{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-secondary mb-2">Key Clues Found</h4>
                                        <div className="space-y-1">
                                            {selectedEvidence.clues.map((clue, index) => (
                                                <div key={index} className="text-sm bg-secondary/10 p-2 rounded">
                                                    • {clue}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Controls */}
                <div className="flex justify-center gap-4">
                    {!gameStarted ? (
                        <Button onClick={startInvestigation} className="cyber-button text-lg py-3 px-8">
                            <Search className="w-5 h-5 mr-2" />
                            Begin Investigation
                        </Button>
                    ) : null}

                    <Button onClick={resetInvestigation} variant="outline" className="border-accent/50 text-accent hover:bg-accent/10">
                        Reset Investigation
                    </Button>
                </div>

                {/* Game Complete */}
                {gameCompleted && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <Card className="glass-card p-8 max-w-lg mx-4">
                            <div className="text-center space-y-4">
                                <FileText className="w-16 h-16 text-accent mx-auto" />
                                <h3 className="text-2xl font-cyber font-bold text-accent">
                                    Investigation Complete
                                </h3>
                                <div className="space-y-3">
                                    <p className="text-xl font-bold text-primary">
                                        Final Score: {score}
                                    </p>
                                    <div className="text-sm text-muted-foreground space-y-1 bg-card/30 p-4 rounded">
                                        <p>Evidence Analyzed: {analyzedCount}/{evidence.length}</p>
                                        <p>Questions Correct: {questions.filter(q => q.isCorrect).length}/{questions.length}</p>
                                        <p>Investigation Time: {formatTime(900 - timeLeft)}</p>
                                        {timeLeft > 300 && <p className="text-accent">Time Bonus Applied!</p>}
                                    </div>
                                </div>
                                <Button onClick={resetInvestigation} className="cyber-button w-full">
                                    New Investigation
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Instructions */}
                {!gameStarted && (
                    <Card className="glass-card p-8 max-w-4xl mx-auto">
                        <h3 className="text-xl font-cyber font-bold text-accent mb-6">
                            Digital Forensics Investigation Protocol
                        </h3>

                        <div className="grid md:grid-cols-2 gap-8 text-sm">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <FileText className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Evidence Analysis</p>
                                        <p className="text-muted-foreground">Examine digital artifacts including emails, logs, network traffic, and file systems</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Search className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Pattern Recognition</p>
                                        <p className="text-muted-foreground">Identify suspicious activities, timeline correlations, and attack vectors</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Target className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Case Building</p>
                                        <p className="text-muted-foreground">Answer investigative questions and build a comprehensive case</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Professional Reporting</p>
                                        <p className="text-muted-foreground">Prepare detailed forensic reports with findings and recommendations</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mt-6">
                            <p className="text-sm text-accent font-semibold mb-2">🔍 Investigation Features</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• Realistic corporate data breach scenario with insider threat</li>
                                <li>• Authentic digital evidence including logs, emails, and network captures</li>
                                <li>• Timeline analysis and correlation of multiple evidence sources</li>
                                <li>• Professional forensic questioning with detailed feedback</li>
                                <li>• Comprehensive reporting requirements for maximum score</li>
                            </ul>
                        </div>
                    </Card>
                )}
            </div>
        </GameLayout>
    );
};

// Enhanced Question Component with Better Feedback
interface QuestionComponentProps {
    question: Question;
    evidence: Evidence[];
    onSubmit: (id: number, answer: string) => void;
    onNext: () => void;
    userAnswer?: string;
    showFeedback: boolean;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
    question, evidence, onSubmit, onNext, userAnswer, showFeedback
}) => {
    const [currentAnswer, setCurrentAnswer] = useState(userAnswer || '');

    const handleSubmit = () => {
        if (!currentAnswer.trim()) {
            toast.error("Please provide an answer");
            return;
        }
        onSubmit(question.id, currentAnswer);
    };

    return (
        <div className="space-y-6">
            <div>
                <h4 className="text-lg font-semibold text-primary mb-3">{question.question}</h4>
                <div className="text-sm text-muted-foreground mb-4">
                    Points: {question.points} | Related Evidence: {question.evidenceIds.map(id => evidence.find(e => e.id === id)?.name).join(', ')}
                </div>
            </div>

            {question.type === 'multiple_choice' && (
                <div className="space-y-2">
                    {question.options?.map((option, index) => (
                        <label key={index} className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={option}
                                checked={currentAnswer === option}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                disabled={question.answered}
                                className="text-primary"
                            />
                            <span className="text-sm">{option}</span>
                        </label>
                    ))}
                </div>
            )}

            {(question.type === 'text_input' || question.type === 'analysis') && (
                <Textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Enter your detailed answer..."
                    rows={question.type === 'analysis' ? 6 : 3}
                    disabled={question.answered}
                    className="bg-card/50 border-primary/20 resize-none"
                />
            )}

            {question.type === 'timeline' && (
                <div className="space-y-2">
                    {question.options?.map((option, index) => (
                        <label key={index} className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={option}
                                checked={currentAnswer === option}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                disabled={question.answered}
                                className="text-primary"
                            />
                            <span className="text-sm font-mono">{option}</span>
                        </label>
                    ))}
                </div>
            )}

            <div className="flex gap-3">
                <Button
                    onClick={handleSubmit}
                    disabled={question.answered || !currentAnswer.trim()}
                    className="cyber-button flex-1"
                >
                    {question.answered ? 'Answered' : 'Submit Answer'}
                </Button>

                {question.answered && showFeedback && (
                    <Button onClick={onNext} className="cyber-button">
                        Next Question
                    </Button>
                )}
            </div>

            {/* Enhanced Feedback Section */}
            {question.answered && showFeedback && (
                <div className="space-y-4">
                    {/* Answer Feedback */}
                    <div className={`p-4 rounded-lg border ${question.isCorrect
                            ? 'border-secondary bg-secondary/10'
                            : 'border-destructive bg-destructive/10'
                        }`}>
                        <div className="flex items-start space-x-3">
                            {question.isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-secondary mt-0.5" />
                            ) : (
                                <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                            )}
                            <div className="flex-1">
                                <h5 className={`font-semibold mb-2 ${question.isCorrect ? 'text-secondary' : 'text-destructive'
                                    }`}>
                                    {question.isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                                </h5>

                                {!question.isCorrect && (
                                    <div className="mb-3">
                                        <p className="text-sm text-destructive font-medium">Your Answer:</p>
                                        <div className="bg-destructive/20 p-2 rounded text-sm mt-1">
                                            {question.userAnswer}
                                        </div>
                                        <p className="text-sm text-secondary font-medium mt-2">Correct Answer:</p>
                                        <div className="bg-secondary/20 p-2 rounded text-sm mt-1">
                                            {question.correctAnswer}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm font-medium text-primary mb-1">Explanation:</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {question.explanation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DigitalForensicsLab;
