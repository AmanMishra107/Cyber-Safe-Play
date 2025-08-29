import React, { useState, useEffect } from "react";
import GameLayout from "@/components/GameLayout";
import { Shield, CheckCircle, XCircle, RotateCcw, Play, AlertTriangle, Globe, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface FirewallRule {
    id: number;
    rule: string;
    description: string;
    type: 'benign' | 'malicious';
    category: string;
    riskLevel: 'low' | 'medium' | 'high';
    placed?: 'permit' | 'deny' | null;
}

const initialRules: FirewallRule[] = [
    {
        id: 1,
        rule: "TCP 80 from any to any",
        description: "Incoming connections on standard web port",
        type: 'benign',
        category: 'Web Services',
        riskLevel: 'low'
    },
    {
        id: 2,
        rule: "TCP 1337 from 192.168.1.100 to any",
        description: "Outbound connection from internal host on non-standard port",
        type: 'malicious',
        category: 'Suspicious Activity',
        riskLevel: 'high'
    },
    {
        id: 3,
        rule: "TCP 443 from any to DMZ",
        description: "SSL connections to demilitarized zone servers",
        type: 'benign',
        category: 'Secure Communications',
        riskLevel: 'low'
    },
    {
        id: 4,
        rule: "ICMP flood from 10.0.0.0/8 to any",
        description: "High volume ping packets from private network range",
        type: 'malicious',
        category: 'DoS Detection',
        riskLevel: 'high'
    },
    {
        id: 5,
        rule: "TCP 22 from admin_subnet to servers",
        description: "Management protocol access from authorized subnet",
        type: 'benign',
        category: 'Administrative Access',
        riskLevel: 'medium'
    },
    {
        id: 6,
        rule: "UDP 53 queries to suspicious-dns.net",
        description: "DNS resolution requests to external resolver",
        type: 'malicious',
        category: 'DNS Security',
        riskLevel: 'medium'
    },
    {
        id: 7,
        rule: "TCP 25 from mail_server to any",
        description: "Email delivery protocol from designated server",
        type: 'benign',
        category: 'Mail Services',
        riskLevel: 'low'
    },
    {
        id: 8,
        rule: "TCP 445 from internet to any",
        description: "File sharing protocol from external sources",
        type: 'malicious',
        category: 'Protocol Exposure',
        riskLevel: 'high'
    }
];

const FirewallBuilder = () => {
    const [score, setScore] = useState(0);
    const [rules, setRules] = useState<FirewallRule[]>(initialRules);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180);
    const [draggedRule, setDraggedRule] = useState<FirewallRule | null>(null);
    const [showResults, setShowResults] = useState(false);
    const [mobileView, setMobileView] = useState('rules'); // 'rules', 'permit', 'deny'
    const [selectedRule, setSelectedRule] = useState<FirewallRule | null>(null);

    // Check if mobile screen
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Timer logic
    useEffect(() => {
        if (gameStarted && !gameCompleted && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !gameCompleted) {
            handleGameEnd();
        }
    }, [timeLeft, gameStarted, gameCompleted]);

    // Check if game is completed
    useEffect(() => {
        if (gameStarted && rules.every(rule => rule.placed !== null && rule.placed !== undefined)) {
            handleGameEnd();
        }
    }, [rules, gameStarted]);

    const handleGameEnd = () => {
        setGameCompleted(true);
        calculateScore();
    };

    const calculateScore = () => {
        let correctPlacements = 0;
        let securityBreaches = 0;
        let serviceDenials = 0;

        rules.forEach(rule => {
            if (
                (rule.type === 'benign' && rule.placed === 'permit') ||
                (rule.type === 'malicious' && rule.placed === 'deny')
            ) {
                correctPlacements++;
            } else if (rule.type === 'malicious' && rule.placed === 'permit') {
                securityBreaches++;
            } else if (rule.type === 'benign' && rule.placed === 'deny') {
                serviceDenials++;
            }
        });

        const accuracy = (correctPlacements / rules.length) * 100;
        const securityPenalty = securityBreaches * 15;
        const servicePenalty = serviceDenials * 10;
        const finalScore = Math.max(0, Math.round(accuracy - securityPenalty - servicePenalty));

        setScore(finalScore);

        if (correctPlacements === rules.length) {
            toast.success("Perfect security configuration!");
        } else if (securityBreaches === 0 && serviceDenials <= 1) {
            toast.success("Strong security posture!");
        } else if (securityBreaches > 0) {
            toast.error(`Security compromised! ${securityBreaches} threats not blocked.`);
        } else {
            toast.warning("Some legitimate services may be impacted.");
        }
    };

    const startGame = () => {
        setGameStarted(true);
        setRules(initialRules.map(rule => ({ ...rule, placed: null })));
        setScore(0);
        setTimeLeft(180);
        setGameCompleted(false);
        setShowResults(false);
        setMobileView('rules');
        toast.info("Network security assessment started.");
    };

    const resetGame = () => {
        setGameStarted(false);
        setGameCompleted(false);
        setRules(initialRules.map(rule => ({ ...rule, placed: null })));
        setScore(0);
        setTimeLeft(180);
        setShowResults(false);
        setMobileView('rules');
        setSelectedRule(null);
    };

    const toggleResults = () => {
        setShowResults(!showResults);
    };

    // Mobile-friendly rule placement
    const placeRule = (rule: FirewallRule, zone: 'permit' | 'deny') => {
        setRules(prevRules =>
            prevRules.map(r =>
                r.id === rule.id ? { ...r, placed: zone } : r
            )
        );
        setSelectedRule(null);
        toast.success(`Rule ${zone === 'permit' ? 'permitted' : 'denied'}`);
    };

    // Touch-friendly drag handlers
    const handleDragStart = (e: React.DragEvent, rule: FirewallRule) => {
        setDraggedRule(rule);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, zone: 'permit' | 'deny') => {
        e.preventDefault();
        if (draggedRule) {
            placeRule(draggedRule, zone);
            setDraggedRule(null);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getRiskColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'high': return 'text-red-500 border-red-500/30 bg-red-500/10';
            case 'medium': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
            case 'low': return 'text-green-500 border-green-500/30 bg-green-500/10';
            default: return 'text-muted-foreground border-muted/30 bg-muted/10';
        }
    };

    const unplacedRules = rules.filter(rule => !rule.placed);
    const permittedRules = rules.filter(rule => rule.placed === 'permit');
    const deniedRules = rules.filter(rule => rule.placed === 'deny');

    // Mobile navigation
    const MobileNav = () => (
        <div className="flex space-x-2 mb-4 overflow-x-auto">
            {['rules', 'permit', 'deny'].map((view) => (
                <Button
                    key={view}
                    onClick={() => setMobileView(view)}
                    variant={mobileView === view ? "default" : "outline"}
                    className={`flex-shrink-0 text-xs sm:text-sm h-8 px-3 ${mobileView === view ? "cyber-button" : "border-primary/50"
                        }`}
                >
                    {view === 'rules' && <Globe className="w-3 h-3 mr-1" />}
                    {view === 'permit' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {view === 'deny' && <XCircle className="w-3 h-3 mr-1" />}
                    {view === 'rules' ? `Rules (${unplacedRules.length})` :
                        view === 'permit' ? `Permit (${permittedRules.length})` :
                            `Deny (${deniedRules.length})`}
                </Button>
            ))}
        </div>
    );

    return (
        <GameLayout title="Firewall Builder" score={score} onRestart={resetGame}>
            <div className="max-w-7xl mx-auto space-y-4 px-2 sm:px-4">
                {/* Game Header */}
                <div className="text-center">
                    <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl sm:text-3xl font-cyber font-bold mb-2 text-primary">
                        Network Security Policy Engine
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mb-6 px-4">
                        Analyze network traffic patterns and configure security policies.
                        Consider protocol behavior and potential threat indicators.
                    </p>
                </div>

                {/* Game Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                    {!gameStarted ? (
                        <Button onClick={startGame} className="cyber-button flex items-center h-10 sm:h-12">
                            <Play className="w-4 h-4 mr-2" />
                            Begin Security Assessment
                        </Button>
                    ) : (
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <div className="glass-card px-3 py-2">
                                <span className="text-xs text-muted-foreground">Time: </span>
                                <span className={`text-sm sm:text-lg font-cyber font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-primary'
                                    }`}>
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                            <div className="glass-card px-3 py-2">
                                <span className="text-xs text-muted-foreground">Progress: </span>
                                <span className="text-sm sm:text-lg font-cyber font-bold text-secondary">
                                    {rules.length - unplacedRules.length}/{rules.length}
                                </span>
                            </div>
                            {gameCompleted && (
                                <Button onClick={toggleResults} variant="outline" size="sm"
                                    className="border-accent/50 text-accent hover:bg-accent/10 h-8">
                                    {showResults ? 'Hide' : 'Show'} Analysis
                                </Button>
                            )}
                        </div>
                    )}
                    <Button onClick={resetGame} variant="outline" size="sm"
                        className="border-accent/50 text-accent hover:bg-accent/10 h-8">
                        <RotateCcw className="w-3 h-3 mr-2" />
                        Reset
                    </Button>
                </div>

                {gameStarted && (
                    <>
                        {/* Mobile Navigation */}
                        {isMobile && <MobileNav />}

                        {/* Desktop Layout */}
                        {!isMobile ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* Available Rules */}
                                <Card className="glass-card p-4">
                                    <h3 className="font-cyber font-bold text-primary mb-4 flex items-center">
                                        <Globe className="mr-2 h-5 w-5" />
                                        Traffic Patterns ({unplacedRules.length})
                                    </h3>
                                    <div className="space-y-3 min-h-[400px] max-h-[500px] overflow-y-auto">
                                        {unplacedRules.map((rule) => (
                                            <div
                                                key={rule.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, rule)}
                                                className="rule-card p-3 rounded-lg bg-card/50 border border-muted hover:border-primary/50 cursor-grab active:cursor-grabbing transition-all hover:scale-105"
                                            >
                                                <div className="space-y-2">
                                                    <h4 className="font-semibold text-sm text-foreground">{rule.rule}</h4>
                                                    <p className="text-xs text-muted-foreground">{rule.description}</p>
                                                    <div className="flex justify-between items-center">
                                                        <Badge variant="outline" className="text-xs">
                                                            {rule.category}
                                                        </Badge>
                                                        <Badge variant="outline" className={`text-xs ${getRiskColor(rule.riskLevel)}`}>
                                                            Risk: {rule.riskLevel}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {unplacedRules.length === 0 && (
                                            <div className="flex items-center justify-center h-32 text-muted-foreground">
                                                All patterns analyzed!
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {/* Permit Policy Zone */}
                                <Card className="glass-card p-4">
                                    <h3 className="font-cyber font-bold text-secondary mb-4 flex items-center">
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        PERMIT Policy ({permittedRules.length})
                                    </h3>
                                    <div
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, 'permit')}
                                        className="min-h-[400px] max-h-[500px] overflow-y-auto p-4 rounded-lg border-2 border-dashed border-secondary/30 bg-secondary/5 hover:border-secondary/50 hover:bg-secondary/10 transition-all space-y-3"
                                    >
                                        <p className="text-sm text-muted-foreground text-center mb-4">
                                            Traffic patterns to ALLOW
                                        </p>
                                        {permittedRules.map((rule) => (
                                            <div key={rule.id} className="rule-card p-3 rounded-lg bg-secondary/20 border border-secondary/30">
                                                <div className="space-y-2">
                                                    <h4 className="font-semibold text-sm text-foreground flex items-center justify-between">
                                                        {rule.rule}
                                                        {showResults && (
                                                            rule.type === 'benign' ? (
                                                                <CheckCircle className="h-4 w-4 text-secondary" />
                                                            ) : (
                                                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                                            )
                                                        )}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">{rule.description}</p>
                                                    <div className="flex justify-between items-center">
                                                        <Badge variant="outline" className="text-xs">
                                                            {rule.category}
                                                        </Badge>
                                                        <Badge variant="outline" className={`text-xs ${getRiskColor(rule.riskLevel)}`}>
                                                            {rule.riskLevel}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {/* Deny Policy Zone */}
                                <Card className="glass-card p-4">
                                    <h3 className="font-cyber font-bold text-red-500 mb-4 flex items-center">
                                        <XCircle className="mr-2 h-5 w-5" />
                                        DENY Policy ({deniedRules.length})
                                    </h3>
                                    <div
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, 'deny')}
                                        className="min-h-[400px] max-h-[500px] overflow-y-auto p-4 rounded-lg border-2 border-dashed border-red-500/30 bg-red-500/5 hover:border-red-500/50 hover:bg-red-500/10 transition-all space-y-3"
                                    >
                                        <p className="text-sm text-muted-foreground text-center mb-4">
                                            Traffic patterns to BLOCK
                                        </p>
                                        {deniedRules.map((rule) => (
                                            <div key={rule.id} className="rule-card p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                                                <div className="space-y-2">
                                                    <h4 className="font-semibold text-sm text-foreground flex items-center justify-between">
                                                        {rule.rule}
                                                        {showResults && (
                                                            rule.type === 'malicious' ? (
                                                                <CheckCircle className="h-4 w-4 text-secondary" />
                                                            ) : (
                                                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                                            )
                                                        )}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">{rule.description}</p>
                                                    <div className="flex justify-between items-center">
                                                        <Badge variant="outline" className="text-xs">
                                                            {rule.category}
                                                        </Badge>
                                                        <Badge variant="outline" className={`text-xs ${getRiskColor(rule.riskLevel)}`}>
                                                            {rule.riskLevel}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            /* Mobile Layout */
                            <Card className="glass-card p-3">
                                {mobileView === 'rules' && (
                                    <>
                                        <h3 className="font-cyber font-bold text-primary mb-3 flex items-center">
                                            <Globe className="mr-2 h-4 w-4" />
                                            Traffic Patterns ({unplacedRules.length})
                                        </h3>
                                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                            {unplacedRules.map((rule) => (
                                                <div
                                                    key={rule.id}
                                                    onClick={() => setSelectedRule(rule)}
                                                    className="rule-card p-3 rounded-lg bg-card/50 border border-muted hover:border-primary/50 cursor-pointer active:scale-95 transition-all"
                                                >
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold text-sm text-foreground">{rule.rule}</h4>
                                                        <p className="text-xs text-muted-foreground">{rule.description}</p>
                                                        <div className="flex justify-between items-center">
                                                            <Badge variant="outline" className="text-xs">
                                                                {rule.category}
                                                            </Badge>
                                                            <Badge variant="outline" className={`text-xs ${getRiskColor(rule.riskLevel)}`}>
                                                                {rule.riskLevel}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {unplacedRules.length === 0 && (
                                                <div className="flex items-center justify-center h-32 text-muted-foreground">
                                                    All patterns analyzed!
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {mobileView === 'permit' && (
                                    <>
                                        <h3 className="font-cyber font-bold text-secondary mb-3 flex items-center">
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            PERMIT Policy ({permittedRules.length})
                                        </h3>
                                        <p className="text-xs text-muted-foreground text-center mb-3">
                                            Traffic patterns to ALLOW
                                        </p>
                                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                            {permittedRules.map((rule) => (
                                                <div key={rule.id} className="rule-card p-3 rounded-lg bg-secondary/20 border border-secondary/30">
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold text-sm text-foreground flex items-center justify-between">
                                                            {rule.rule}
                                                            {showResults && (
                                                                rule.type === 'benign' ? (
                                                                    <CheckCircle className="h-4 w-4 text-secondary" />
                                                                ) : (
                                                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                                                )
                                                            )}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground">{rule.description}</p>
                                                        <div className="flex justify-between items-center">
                                                            <Badge variant="outline" className="text-xs">
                                                                {rule.category}
                                                            </Badge>
                                                            <Badge variant="outline" className={`text-xs ${getRiskColor(rule.riskLevel)}`}>
                                                                {rule.riskLevel}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {permittedRules.length === 0 && (
                                                <div className="text-center text-muted-foreground py-8">
                                                    No rules permitted yet
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {mobileView === 'deny' && (
                                    <>
                                        <h3 className="font-cyber font-bold text-red-500 mb-3 flex items-center">
                                            <XCircle className="mr-2 h-4 w-4" />
                                            DENY Policy ({deniedRules.length})
                                        </h3>
                                        <p className="text-xs text-muted-foreground text-center mb-3">
                                            Traffic patterns to BLOCK
                                        </p>
                                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                            {deniedRules.map((rule) => (
                                                <div key={rule.id} className="rule-card p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold text-sm text-foreground flex items-center justify-between">
                                                            {rule.rule}
                                                            {showResults && (
                                                                rule.type === 'malicious' ? (
                                                                    <CheckCircle className="h-4 w-4 text-secondary" />
                                                                ) : (
                                                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                                                )
                                                            )}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground">{rule.description}</p>
                                                        <div className="flex justify-between items-center">
                                                            <Badge variant="outline" className="text-xs">
                                                                {rule.category}
                                                            </Badge>
                                                            <Badge variant="outline" className={`text-xs ${getRiskColor(rule.riskLevel)}`}>
                                                                {rule.riskLevel}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {deniedRules.length === 0 && (
                                                <div className="text-center text-muted-foreground py-8">
                                                    No rules denied yet
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </Card>
                        )}
                    </>
                )}

                {/* Mobile Rule Selection Modal */}
                {selectedRule && isMobile && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <Card className="glass-card p-4 w-full max-w-md">
                            <h3 className="font-cyber font-bold text-primary mb-3">Classify Rule</h3>
                            <div className="space-y-3 mb-4">
                                <h4 className="font-semibold text-sm">{selectedRule.rule}</h4>
                                <p className="text-xs text-muted-foreground">{selectedRule.description}</p>
                                <div className="flex justify-between items-center">
                                    <Badge variant="outline" className="text-xs">
                                        {selectedRule.category}
                                    </Badge>
                                    <Badge variant="outline" className={`text-xs ${getRiskColor(selectedRule.riskLevel)}`}>
                                        Risk: {selectedRule.riskLevel}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <Button
                                    onClick={() => placeRule(selectedRule, 'permit')}
                                    className="flex-1 bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 h-10"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    PERMIT
                                </Button>
                                <Button
                                    onClick={() => placeRule(selectedRule, 'deny')}
                                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/30 h-10"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    DENY
                                </Button>
                            </div>
                            <Button
                                onClick={() => setSelectedRule(null)}
                                variant="outline"
                                className="w-full mt-3 h-8 text-xs"
                            >
                                Cancel
                            </Button>
                        </Card>
                    </div>
                )}

                {/* Game Complete Modal */}
                {gameCompleted && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <Card className="glass-card p-6 max-w-sm mx-4 w-full">
                            <div className="text-center space-y-4">
                                <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto" />
                                <h3 className="text-xl sm:text-2xl font-cyber font-bold text-primary">
                                    Security Assessment Complete
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-lg font-bold text-secondary">
                                        Security Score: {score}%
                                    </p>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p>Correct Classifications: {rules.filter(rule =>
                                            (rule.type === 'benign' && rule.placed === 'permit') ||
                                            (rule.type === 'malicious' && rule.placed === 'deny')
                                        ).length} / {rules.length}</p>
                                        <p>Security Breaches: {rules.filter(rule =>
                                            rule.type === 'malicious' && rule.placed === 'permit'
                                        ).length}</p>
                                        <p>Service Denials: {rules.filter(rule =>
                                            rule.type === 'benign' && rule.placed === 'deny'
                                        ).length}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button onClick={resetGame} className="cyber-button flex-1 h-10">
                                        New Assessment
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Instructions for new users */}
                {!gameStarted && (
                    <div className="text-center">
                        <Card className="glass-card p-6 max-w-2xl mx-auto">
                            <h3 className="text-lg sm:text-xl font-cyber font-bold text-primary mb-4">
                                Security Analyst Challenge
                            </h3>
                            <div className="space-y-4 text-left">
                                <div className="flex items-start space-x-3">
                                    <Globe className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Analyze Traffic Patterns:</strong> Review protocol types, port numbers,
                                            source/destination patterns, and connection behaviors.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Risk Assessment:</strong> Consider risk levels and whether traffic
                                            patterns indicate normal operations or potential threats.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Shield className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>Security vs Availability:</strong> Balance blocking threats while
                                            maintaining legitimate business services.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-accent/10 p-3 rounded-lg mt-4">
                                    <p className="text-xs text-accent">
                                        <strong>Mobile users:</strong> Tap rules to classify them. Desktop users can drag and drop.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                }

                .rule-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                }

                .rule-card:active {
                    transform: scale(0.98);
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

                    .rule-card {
                        padding: 0.75rem;
                    }

                    .glass-card {
                        border-radius: 0.75rem;
                    }
                }

                /* Prevent text selection during drag operations */
                [draggable="true"] {
                    -webkit-user-drag: element;
                    -webkit-user-select: none;
                    user-select: none;
                }

                /* Smooth scroll behavior */
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
            `}</style>
        </GameLayout>
    );
};

export default FirewallBuilder;
