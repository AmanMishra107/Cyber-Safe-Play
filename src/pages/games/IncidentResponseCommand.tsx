import React, { useState, useEffect } from "react";
import GameLayout from "@/components/GameLayout";
import {
    AlertCircle,
    Shield,
    Clock,
    Users,
    Database,
    Network,
    Eye,
    Lock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Activity,
    FileText,
    Phone,
    Zap,
    Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface IncidentPhase {
    id: number;
    name: string;
    description: string;
    timeLimit: number;
    criticalActions: string[];
    completed: boolean;
}

interface Decision {
    id: number;
    scenario: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    options: {
        id: number;
        text: string;
        impact: 'positive' | 'negative' | 'neutral';
        points: number;
        consequence: string;
        isOptimal: boolean;
    }[];
    phase: number;
    context: string;
    evidence: string[];
}

interface IncidentState {
    containmentLevel: number;
    systemsAffected: number;
    publicExposure: number;
    businessImpact: number;
    timeElapsed: number;
    phase: number;
}

const incidentPhases: IncidentPhase[] = [
    {
        id: 1,
        name: "Detection & Analysis",
        description: "Identify the scope and nature of the security incident",
        timeLimit: 300,
        criticalActions: ["Verify incident authenticity", "Assess initial scope", "Document findings"],
        completed: false
    },
    {
        id: 2,
        name: "Containment & Eradication",
        description: "Isolate affected systems and eliminate the threat",
        timeLimit: 600,
        criticalActions: ["Isolate affected systems", "Preserve evidence", "Remove malicious artifacts"],
        completed: false
    },
    {
        id: 3,
        name: "Recovery & Monitoring",
        description: "Restore operations and implement monitoring",
        timeLimit: 400,
        criticalActions: ["Validate system integrity", "Restore services", "Implement monitoring"],
        completed: false
    },
    {
        id: 4,
        name: "Post-Incident Analysis",
        description: "Document lessons learned and improve procedures",
        timeLimit: 200,
        criticalActions: ["Create incident report", "Update procedures", "Brief stakeholders"],
        completed: false
    }
];

const expertDecisions: Decision[] = [
    {
        id: 1,
        scenario: "Multiple employees report their computers are running slowly and displaying pop-up messages demanding Bitcoin payment. Network monitoring shows unusual encrypted traffic patterns.",
        urgency: 'critical',
        phase: 1,
        context: "Suspected ransomware attack affecting multiple endpoints",
        evidence: [
            "15 workstations showing ransom messages",
            "Encrypted network traffic to unknown IPs",
            "File extensions changed to .locked",
            "Domain controller logs show lateral movement"
        ],
        options: [
            {
                id: 1,
                text: "Immediately disconnect all affected systems from the network",
                impact: 'positive',
                points: 25,
                consequence: "Prevented further spread but may have lost some forensic evidence",
                isOptimal: true
            },
            {
                id: 2,
                text: "Keep systems online to monitor the attack progression",
                impact: 'negative',
                points: -15,
                consequence: "Ransomware spread to 40+ additional systems including servers",
                isOptimal: false
            },
            {
                id: 3,
                text: "Selectively isolate critical systems while monitoring others",
                impact: 'positive',
                points: 20,
                consequence: "Balanced approach - contained spread while preserving evidence",
                isOptimal: false
            },
            {
                id: 4,
                text: "Wait for more information before taking action",
                impact: 'negative',
                points: -25,
                consequence: "Critical delay allowed encryption of backup systems",
                isOptimal: false
            }
        ]
    },
    {
        id: 2,
        scenario: "Initial analysis confirms a sophisticated APT attack. Threat actors have been in the environment for 3 weeks with administrative privileges. Critical customer data may be compromised.",
        urgency: 'critical',
        phase: 1,
        context: "Advanced Persistent Threat with potential data exfiltration",
        evidence: [
            "Backdoor discovered on web server",
            "Credential dumping tools found",
            "3 weeks of suspicious PowerShell activity",
            "Large data transfers to external IPs"
        ],
        options: [
            {
                id: 1,
                text: "Immediately notify law enforcement and regulatory bodies",
                impact: 'positive',
                points: 15,
                consequence: "Compliance maintained but may alert attackers",
                isOptimal: false
            },
            {
                id: 2,
                text: "Focus on evidence preservation before notifications",
                impact: 'positive',
                points: 25,
                consequence: "Secured critical forensic evidence for investigation",
                isOptimal: true
            },
            {
                id: 3,
                text: "Immediately change all administrative passwords",
                impact: 'neutral',
                points: 10,
                consequence: "Partial mitigation but attackers may have other persistence mechanisms",
                isOptimal: false
            },
            {
                id: 4,
                text: "Rebuild all affected systems from scratch immediately",
                impact: 'negative',
                points: -10,
                consequence: "Destroyed valuable forensic evidence needed for investigation",
                isOptimal: false
            }
        ]
    },
    {
        id: 3,
        scenario: "Forensic analysis reveals the attackers have access to the domain controller and have created multiple backdoor accounts. They're actively exfiltrating financial records.",
        urgency: 'critical',
        phase: 2,
        context: "Domain compromise with active data exfiltration",
        evidence: [
            "5 unauthorized admin accounts created",
            "Mimikatz executed on DC",
            "Scheduled tasks for persistence",
            "Financial database being copied"
        ],
        options: [
            {
                id: 1,
                text: "Take domain controller offline and rebuild Active Directory",
                impact: 'positive',
                points: 30,
                consequence: "Stopped exfiltration but caused significant business downtime",
                isOptimal: true
            },
            {
                id: 2,
                text: "Remove backdoor accounts and monitor for recompromise",
                impact: 'negative',
                points: -5,
                consequence: "Attackers regained access through other persistence mechanisms",
                isOptimal: false
            },
            {
                id: 3,
                text: "Block external network access while investigating",
                impact: 'neutral',
                points: 15,
                consequence: "Stopped data exfiltration but attackers remain in environment",
                isOptimal: false
            },
            {
                id: 4,
                text: "Reset all user passwords and force re-authentication",
                impact: 'positive',
                points: 20,
                consequence: "Disrupted attacker access but some persistence mechanisms remain",
                isOptimal: false
            }
        ]
    },
    {
        id: 4,
        scenario: "Operations are restored but the board demands answers. Legal wants detailed documentation for potential litigation against the attackers. Insurance requires comprehensive incident report.",
        urgency: 'medium',
        phase: 4,
        context: "Stakeholder management and documentation",
        evidence: [
            "Complete forensic timeline",
            "Financial impact assessment",
            "Technical details of compromise",
            "Response effectiveness metrics"
        ],
        options: [
            {
                id: 1,
                text: "Create comprehensive technical report with lessons learned",
                impact: 'positive',
                points: 20,
                consequence: "Thorough documentation helped improve security posture",
                isOptimal: true
            },
            {
                id: 2,
                text: "Focus on blame assignment and disciplinary actions",
                impact: 'negative',
                points: -15,
                consequence: "Blame culture hindered future security cooperation",
                isOptimal: false
            },
            {
                id: 3,
                text: "Minimize incident details to protect company reputation",
                impact: 'negative',
                points: -10,
                consequence: "Lack of transparency prevented learning and improvement",
                isOptimal: false
            },
            {
                id: 4,
                text: "Publish detailed public case study for industry education",
                impact: 'positive',
                points: 15,
                consequence: "Industry recognition but some competitive information exposed",
                isOptimal: false
            }
        ]
    }
];

const IncidentResponseCommand: React.FC = () => {
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [currentPhase, setCurrentPhase] = useState(1);
    const [currentDecision, setCurrentDecision] = useState(0);
    const [timeLeft, setTimeLeft] = useState(300);
    const [phases, setPhases] = useState(incidentPhases);
    const [decisions] = useState(expertDecisions);
    const [incidentState, setIncidentState] = useState<IncidentState>({
        containmentLevel: 0,
        systemsAffected: 15,
        publicExposure: 0,
        businessImpact: 100,
        timeElapsed: 0,
        phase: 1
    });
    const [selectedDecision, setSelectedDecision] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [responses, setResponses] = useState<{ decisionId: number, optionId: number, points: number }[]>([]);

    // Check if mobile screen
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Timer effect
    useEffect(() => {
        if (gameStarted && !gameCompleted && timeLeft > 0 && !showFeedback) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
                setIncidentState(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showFeedback) {
            handleTimeExpired();
        }
    }, [timeLeft, gameStarted, gameCompleted, showFeedback]);

    const startGame = () => {
        setGameStarted(true);
        setGameCompleted(false);
        setScore(0);
        setCurrentPhase(1);
        setCurrentDecision(0);
        setTimeLeft(phases[0].timeLimit);
        setIncidentState({
            containmentLevel: 0,
            systemsAffected: 15,
            publicExposure: 0,
            businessImpact: 100,
            timeElapsed: 0,
            phase: 1
        });
        setSelectedDecision(null);
        setShowFeedback(false);
        setResponses([]);
        toast.info("🚨 CRITICAL INCIDENT DETECTED! Begin response immediately.");
    };

    const handleTimeExpired = () => {
        toast.error("Time expired! Incident escalated due to delayed response.");
        setIncidentState(prev => ({
            ...prev,
            businessImpact: prev.businessImpact + 20,
            publicExposure: prev.publicExposure + 15
        }));
        proceedToNext();
    };

    const handleDecision = (optionId: number) => {
        const decision = decisions[currentDecision];
        const selectedOption = decision.options.find(opt => opt.id === optionId);

        if (!selectedOption) return;

        setSelectedDecision(optionId);
        setShowFeedback(true);

        // Update score
        setScore(prev => prev + selectedOption.points);

        // Record response
        setResponses(prev => [...prev, {
            decisionId: decision.id,
            optionId: selectedOption.id,
            points: selectedOption.points
        }]);

        // Update incident state based on decision impact
        setIncidentState(prev => {
            let newState = { ...prev };

            if (selectedOption.impact === 'positive') {
                newState.containmentLevel = Math.min(100, prev.containmentLevel + 20);
                newState.systemsAffected = Math.max(0, prev.systemsAffected - 5);
                newState.businessImpact = Math.max(0, prev.businessImpact - 10);
            } else if (selectedOption.impact === 'negative') {
                newState.systemsAffected = prev.systemsAffected + 10;
                newState.businessImpact = Math.min(200, prev.businessImpact + 20);
                newState.publicExposure = Math.min(100, prev.publicExposure + 15);
            }

            return newState;
        });

        // Show result toast
        if (selectedOption.isOptimal) {
            toast.success(`Excellent decision! +${selectedOption.points} points`);
        } else if (selectedOption.impact === 'positive') {
            toast.success(`Good decision! +${selectedOption.points} points`);
        } else {
            toast.error(`Suboptimal choice. ${selectedOption.points} points`);
        }
    };

    const proceedToNext = () => {
        if (currentDecision < decisions.length - 1) {
            const nextDecision = currentDecision + 1;
            const nextPhase = decisions[nextDecision].phase;

            if (nextPhase !== currentPhase) {
                // Mark current phase as completed
                setPhases(prev => prev.map(phase =>
                    phase.id === currentPhase ? { ...phase, completed: true } : phase
                ));

                setCurrentPhase(nextPhase);
                setTimeLeft(phases[nextPhase - 1].timeLimit);
            }

            setCurrentDecision(nextDecision);
            setSelectedDecision(null);
            setShowFeedback(false);
        } else {
            completeGame();
        }
    };

    const completeGame = () => {
        setGameCompleted(true);

        // Calculate final score modifiers
        const timeBonus = Math.max(0, Math.floor((phases.reduce((acc, phase) => acc + phase.timeLimit, 0) - incidentState.timeElapsed) / 10));
        const containmentBonus = Math.floor(incidentState.containmentLevel / 2);
        const impactPenalty = Math.floor(incidentState.businessImpact / 5);

        const finalScore = score + timeBonus + containmentBonus - impactPenalty;
        setScore(finalScore);

        toast.success(`Incident Response Complete! Final Score: ${finalScore}`);
    };

    const resetGame = () => {
        setGameStarted(false);
        setGameCompleted(false);
        setScore(0);
        setCurrentPhase(1);
        setCurrentDecision(0);
        setTimeLeft(300);
        setPhases(incidentPhases.map(phase => ({ ...phase, completed: false })));
        setSelectedDecision(null);
        setShowFeedback(false);
        setResponses([]);
        setIncidentState({
            containmentLevel: 0,
            systemsAffected: 15,
            publicExposure: 0,
            businessImpact: 100,
            timeElapsed: 0,
            phase: 1
        });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'critical': return 'text-red-500 border-red-500';
            case 'high': return 'text-orange-500 border-orange-500';
            case 'medium': return 'text-yellow-500 border-yellow-500';
            default: return 'text-primary border-primary';
        }
    };

    const getCurrentDecisionData = () => decisions[currentDecision];

    return (
        <GameLayout title="Incident Response Command" score={score} onRestart={resetGame}>
            <div className="max-w-7xl mx-auto space-y-4 px-2 sm:px-4 lg:px-6">
                {/* Header */}
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4 animate-pulse" />
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cyber font-bold mb-2 text-red-500">
                        Incident Response Command Center
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-3xl mx-auto mb-6 px-4">
                        Lead expert-level incident response operations. Make critical decisions under pressure
                        to contain threats and minimize business impact.
                    </p>
                </div>

                {/* Game Status - Responsive Grid */}
                {gameStarted && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
                        <Card className="glass-card p-3 sm:p-4 text-center">
                            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-2" />
                            <div className={`text-lg sm:text-xl font-cyber font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary'
                                }`}>
                                {formatTime(timeLeft)}
                            </div>
                            <div className="text-xs text-muted-foreground">Time Left</div>
                        </Card>
                        <Card className="glass-card p-3 sm:p-4 text-center">
                            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-secondary mx-auto mb-2" />
                            <div className="text-lg sm:text-xl font-cyber font-bold text-secondary">
                                {incidentState.containmentLevel}%
                            </div>
                            <div className="text-xs text-muted-foreground">Contained</div>
                        </Card>
                        <Card className="glass-card p-3 sm:p-4 text-center">
                            <Database className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mx-auto mb-2" />
                            <div className="text-lg sm:text-xl font-cyber font-bold text-red-500">
                                {incidentState.systemsAffected}
                            </div>
                            <div className="text-xs text-muted-foreground">Systems Affected</div>
                        </Card>
                        <Card className="glass-card p-3 sm:p-4 text-center">
                            <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mx-auto mb-2" />
                            <div className="text-lg sm:text-xl font-cyber font-bold text-yellow-500">
                                {incidentState.businessImpact}%
                            </div>
                            <div className="text-xs text-muted-foreground">Business Impact</div>
                        </Card>
                        <Card className="glass-card p-3 sm:p-4 text-center col-span-2 sm:col-span-1">
                            <div className="text-lg sm:text-xl font-cyber font-bold text-accent">{score}</div>
                            <div className="text-xs text-muted-foreground">Response Score</div>
                        </Card>
                    </div>
                )}

                {/* Phase Progress */}
                {gameStarted && (
                    <Card className="glass-card p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <h3 className="font-cyber font-bold text-primary text-lg sm:text-xl">
                                Phase {currentPhase}: {phases[currentPhase - 1]?.name}
                            </h3>
                            <Badge className={`${getUrgencyColor(getCurrentDecisionData()?.urgency || 'low')} text-xs sm:text-sm`}>
                                {getCurrentDecisionData()?.urgency?.toUpperCase()} PRIORITY
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            {phases[currentPhase - 1]?.description}
                        </p>
                        <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-2">
                            {phases.map((phase, index) => (
                                <div key={phase.id} className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${phase.completed ? 'bg-secondary' :
                                            index + 1 === currentPhase ? 'bg-primary animate-pulse' :
                                                'bg-muted'
                                        }`} />
                                    <span className={`text-xs sm:text-sm ${phase.completed ? 'text-secondary' :
                                            index + 1 === currentPhase ? 'text-primary' :
                                                'text-muted-foreground'
                                        }`}>
                                        {phase.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Decision Interface */}
                {gameStarted && !gameCompleted && getCurrentDecisionData() && (
                    <Card className="glass-card p-4 sm:p-6">
                        <div className="space-y-6">
                            {/* Context and Evidence */}
                            <div className="bg-card/50 p-4 rounded-lg border border-red-500/30">
                                <h4 className="font-semibold text-red-500 mb-3 flex items-center text-sm sm:text-base">
                                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                    Incident Context: {getCurrentDecisionData().context}
                                </h4>
                                <p className="text-foreground mb-4 leading-relaxed text-sm sm:text-base">
                                    {getCurrentDecisionData().scenario}
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <h5 className="font-semibold text-accent mb-2 text-sm sm:text-base">Evidence Available:</h5>
                                        <div className="max-h-32 sm:max-h-none overflow-y-auto">
                                            <ul className="space-y-1">
                                                {getCurrentDecisionData().evidence.map((item, index) => (
                                                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                                                        <Target className="h-3 w-3 mt-0.5 mr-2 text-accent flex-shrink-0" />
                                                        <span className="break-words">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decision Options - Mobile Optimized */}
                            {!showFeedback && (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-primary text-base sm:text-lg">
                                        Select Your Response Action:
                                    </h4>
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {getCurrentDecisionData().options.map((option) => (
                                            <Button
                                                key={option.id}
                                                onClick={() => handleDecision(option.id)}
                                                variant="outline"
                                                className="w-full p-4 sm:p-6 h-auto text-left justify-start border-muted hover:border-primary/50 transition-all duration-300"
                                            >
                                                <div className="w-full">
                                                    <p className="text-sm sm:text-base font-medium break-words leading-relaxed">
                                                        {option.text}
                                                    </p>
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Feedback */}
                            {showFeedback && selectedDecision && (
                                <div className="space-y-4">
                                    <div className="bg-card/50 p-4 rounded-lg border border-accent/20">
                                        <h4 className="font-semibold text-accent mb-3 text-sm sm:text-base">Your Decision:</h4>
                                        <p className="text-sm sm:text-base mb-4 break-words">
                                            "{getCurrentDecisionData().options.find(opt => opt.id === selectedDecision)?.text}"
                                        </p>

                                        <div className={`p-3 rounded border ${getCurrentDecisionData().options.find(opt => opt.id === selectedDecision)?.impact === 'positive'
                                                ? 'border-secondary/30 bg-secondary/10'
                                                : getCurrentDecisionData().options.find(opt => opt.id === selectedDecision)?.impact === 'negative'
                                                    ? 'border-red-500/30 bg-red-500/10'
                                                    : 'border-yellow-500/30 bg-yellow-500/10'
                                            }`}>
                                            <div className="flex items-center mb-2">
                                                {getCurrentDecisionData().options.find(opt => opt.id === selectedDecision)?.impact === 'positive' ? (
                                                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary mr-2" />
                                                ) : getCurrentDecisionData().options.find(opt => opt.id === selectedDecision)?.impact === 'negative' ? (
                                                    <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2" />
                                                ) : (
                                                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mr-2" />
                                                )}
                                                <span className="font-semibold text-sm sm:text-base">
                                                    {getCurrentDecisionData().options.find(opt => opt.id === selectedDecision)?.isOptimal
                                                        ? 'Optimal Response!'
                                                        : 'Response Outcome:'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground break-words">
                                                {getCurrentDecisionData().options.find(opt => opt.id === selectedDecision)?.consequence}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <Button onClick={proceedToNext} className="cyber-button h-10 sm:h-12">
                                            {currentDecision < decisions.length - 1 ? 'Continue Response' : 'Complete Incident Response'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                )}

                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    {!gameStarted ? (
                        <Button onClick={startGame} className="cyber-button text-base sm:text-lg py-3 px-8 h-12 sm:h-14">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            Begin Emergency Response
                        </Button>
                    ) : null}

                    <Button
                        onClick={resetGame}
                        variant="outline"
                        className="border-accent/50 text-accent hover:bg-accent/10 h-10 sm:h-12"
                    >
                        Reset Incident
                    </Button>
                </div>

                {/* Game Complete Modal */}
                {gameCompleted && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <Card className="glass-card p-6 sm:p-8 max-w-md sm:max-w-lg mx-4 w-full">
                            <div className="text-center space-y-4">
                                {score >= 80 ? (
                                    <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-secondary mx-auto" />
                                ) : score >= 50 ? (
                                    <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto" />
                                ) : (
                                    <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto" />
                                )}

                                <h3 className="text-xl sm:text-2xl font-cyber font-bold text-secondary">
                                    Incident Response Complete
                                </h3>

                                <div className="space-y-2">
                                    <p className="text-lg sm:text-xl font-bold text-primary">
                                        Final Score: {score}
                                    </p>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p>Containment Level: {incidentState.containmentLevel}%</p>
                                        <p>Systems Affected: {incidentState.systemsAffected}</p>
                                        <p>Business Impact: {incidentState.businessImpact}%</p>
                                        <p>Response Time: {Math.floor(incidentState.timeElapsed / 60)}m {incidentState.timeElapsed % 60}s</p>
                                    </div>
                                </div>

                                <div className="bg-card/30 p-4 rounded text-center">
                                    <p className="text-sm font-semibold mb-2">
                                        {score >= 80 ? '🏆 Expert Response Leader!' :
                                            score >= 50 ? '✅ Competent Incident Responder' :
                                                '📚 Additional Training Recommended'}
                                    </p>
                                    <p className="text-xs text-muted-foreground break-words">
                                        {score >= 80 ? 'Outstanding leadership under pressure with optimal decision-making.' :
                                            score >= 50 ? 'Solid response with room for improvement in critical decisions.' :
                                                'Review incident response procedures and practice decision-making scenarios.'}
                                    </p>
                                </div>

                                <Button onClick={resetGame} className="cyber-button w-full h-10 sm:h-12">
                                    New Incident Response
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Instructions */}
                {!gameStarted && (
                    <Card className="glass-card p-6 sm:p-8 max-w-4xl mx-auto">
                        <h3 className="text-lg sm:text-xl font-cyber font-bold text-primary mb-6">
                            Expert Incident Response Training
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-sm">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Eye className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm sm:text-base">Detection & Analysis</p>
                                        <p className="text-muted-foreground text-xs sm:text-sm">
                                            Rapidly assess incident scope, preserve evidence, and determine response strategy
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Shield className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm sm:text-base">Containment & Eradication</p>
                                        <p className="text-muted-foreground text-xs sm:text-sm">
                                            Isolate threats, remove malware, and prevent lateral movement
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Activity className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm sm:text-base">Recovery & Monitoring</p>
                                        <p className="text-muted-foreground text-xs sm:text-sm">
                                            Restore operations safely while implementing enhanced monitoring
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm sm:text-base">Post-Incident Analysis</p>
                                        <p className="text-muted-foreground text-xs sm:text-sm">
                                            Document lessons learned and improve response procedures
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-6">
                            <p className="text-sm text-red-500 font-semibold mb-2">🚨 Expert Level Features</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• Time-pressured decision making under crisis conditions</li>
                                <li>• Complex multi-phase incident response scenarios</li>
                                <li>• Real-world APT attack patterns and zero-day exploits</li>
                                <li>• Business impact considerations and stakeholder management</li>
                                <li>• Advanced threat containment and eradication techniques</li>
                                <li>• Evidence preservation and forensic considerations</li>
                            </ul>
                        </div>
                    </Card>
                )}
            </div>

            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                }

                .cyber-button {
                    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%);
                    border: none;
                    color: white;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .cyber-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.4);
                }

                @media (max-width: 640px) {
                    .container {
                        padding-left: 0.5rem;
                        padding-right: 0.5rem;
                    }
                }

                /* Smooth scrolling for overflowing areas */
                .overflow-y-auto {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
                }

                .overflow-y-auto::-webkit-scrollbar {
                    width: 6px;
                }

                .overflow-y-auto::-webkit-scrollbar-track {
                    background: transparent;
                }

                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.3);
                    border-radius: 3px;
                }

                /* Text wrapping and breaking */
                .break-words {
                    word-break: break-word;
                    hyphens: auto;
                }
            `}</style>
        </GameLayout>
    );
};

export default IncidentResponseCommand;
