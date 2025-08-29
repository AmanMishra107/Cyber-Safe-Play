import React, { useState, useEffect } from "react";
import GameLayout from "@/components/GameLayout";
import { Eye, Shield, AlertTriangle, CheckCircle, Phone, Mail, MessageSquare, User, Building, Clock, Target, XCircle, Play, RefreshCw, Gift, CreditCard, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Scenario {
    id: number;
    title: string;
    type: 'phishing' | 'pretexting' | 'baiting' | 'tailgating' | 'quid_pro_quo' | 'romance' | 'lottery' | 'authority';
    difficulty: 'easy' | 'medium' | 'hard';
    context: string;
    situation: string;
    attackerMessage: string;
    redFlags: string[];
    safeActions: string[];
    riskyActions: string[];
    explanation: string;
    points: number;
    icon: any;
}

interface Choice {
    id: number;
    text: string;
    type: 'safe' | 'risky' | 'neutral';
    explanation: string;
    points: number;
}

const socialEngineeringScenarios: Scenario[] = [
    {
        id: 1,
        title: "Urgent IT Support Call",
        type: 'pretexting',
        difficulty: 'easy',
        context: "You receive a phone call at work",
        situation: "A person claiming to be from IT support calls you during work hours.",
        attackerMessage: "Hi, this is Tom from IT Support. We're experiencing a critical security breach and need to verify your login credentials immediately to secure your account. Can you please provide your username and password so we can update our security protocols?",
        redFlags: ["Urgent request for sensitive information", "Asking for passwords over phone", "Claims of security breach", "No proper identification"],
        safeActions: ["Hang up and call IT directly", "Ask for employee ID and verify", "Report the call to security"],
        riskyActions: ["Provide password information", "Give personal details", "Follow instructions immediately"],
        explanation: "Legitimate IT support will never ask for your password over the phone. Always verify the caller's identity through official channels.",
        points: 100,
        icon: Phone
    },
    {
        id: 2,
        title: "Suspicious Email from Bank",
        type: 'phishing',
        difficulty: 'easy',
        context: "You receive an email in your personal inbox",
        situation: "An email claiming to be from your bank about suspicious account activity.",
        attackerMessage: "URGENT: Suspicious activity detected on your account! Your account will be suspended in 24 hours unless you verify your information immediately. Click here to secure your account: www.bank-security-update.com/verify",
        redFlags: ["Urgent deadline pressure", "Suspicious URL domain", "Generic greeting", "Threat of account suspension"],
        safeActions: ["Go directly to bank's official website", "Call bank using official phone number", "Delete the email"],
        riskyActions: ["Click the link in email", "Enter personal information", "Download attachments"],
        explanation: "Banks never ask for personal information via email. Always access your bank account by typing the official URL directly into your browser.",
        points: 100,
        icon: Mail
    },
    {
        id: 3,
        title: "Free USB Drive in Parking Lot",
        type: 'baiting',
        difficulty: 'medium',
        context: "You find something in your office parking lot",
        situation: "You discover a USB drive labeled 'Executive Salary Information - Confidential' near your car.",
        attackerMessage: "The USB drive looks official and has your company's logo on it. There's a note attached saying 'Please return to HR department if found.'",
        redFlags: ["Unknown USB device", "Sensitive information label", "Found in unsecured location", "Too tempting to ignore"],
        safeActions: ["Turn it in to security without plugging in", "Report found device to IT", "Do not connect to any computer"],
        riskyActions: ["Plug it into work computer", "Plug it into personal computer", "Open files to see contents"],
        explanation: "USB baiting is a common attack method. Unknown USB devices can contain malware that automatically installs when connected.",
        points: 150,
        icon: Target
    },
    {
        id: 4,
        title: "LinkedIn Connection Request",
        type: 'phishing',
        difficulty: 'medium',
        context: "You receive a social media notification",
        situation: "A LinkedIn connection request from someone claiming to be a recruiter at a prestigious company.",
        attackerMessage: "Hi! I'm Sarah Johnson, Senior Recruiter at Google. I saw your profile and think you'd be perfect for a high-paying position we have open. I need to verify some information for our background check. Can you confirm your current employer and provide your work email?",
        redFlags: ["Unsolicited job offer", "Immediate request for personal info", "Too good to be true opportunity", "Pressure to respond quickly"],
        safeActions: ["Research the person thoroughly", "Verify through official company channels", "Be cautious with personal information"],
        riskyActions: ["Immediately share work details", "Provide personal information", "Click on any links they send"],
        explanation: "Scammers often pose as recruiters to gather personal and professional information. Always verify through official company channels.",
        points: 125,
        icon: User
    },
    {
        id: 5,
        title: "Building Access Tailgating",
        type: 'tailgating',
        difficulty: 'easy',
        context: "You're entering your office building",
        situation: "Someone approaches as you're using your keycard to enter the building.",
        attackerMessage: "Hey, thanks for holding the door! I forgot my badge again - happens all the time, right? I work on the 5th floor in accounting. You probably know my boss, Jennifer from the finance team?",
        redFlags: ["Doesn't have proper access badge", "Claims to work there but no verification", "Uses social pressure", "Mentions common names"],
        safeActions: ["Ask them to get their own badge", "Direct them to reception", "Verify their identity with security"],
        riskyActions: ["Let them follow you in", "Give them access without verification", "Assume they belong there"],
        explanation: "Tailgating is when unauthorized people follow authorized personnel into secure areas. Always ensure everyone has proper access credentials.",
        points: 100,
        icon: Building
    },
    {
        id: 6,
        title: "Technical Support Scam",
        type: 'quid_pro_quo',
        difficulty: 'medium',
        context: "You receive a phone call at home",
        situation: "Someone calls claiming your computer has been sending virus alerts to their security center.",
        attackerMessage: "Hello, this is Microsoft Security Center. Our systems show your computer is infected with dangerous viruses and is sending spam emails. We can help you fix this for free, but we need remote access to your computer to clean it. Can you go to teamviewer.com and download our software?",
        redFlags: ["Unsolicited call about computer problems", "Claims to be from major tech company", "Requests remote access", "Free help that seems too good"],
        safeActions: ["Hang up immediately", "Run your own antivirus scan", "Contact Microsoft directly if concerned"],
        riskyActions: ["Download suggested software", "Give remote access", "Provide credit card information"],
        explanation: "Microsoft and other tech companies never call users unsolicited about computer problems. This is a common scam to gain access to your computer.",
        points: 150,
        icon: Phone
    },
    // 5 NEW SCENARIOS BELOW:
    {
        id: 7,
        title: "Fake Prize Notification",
        type: 'lottery',
        difficulty: 'easy',
        context: "You receive a text message on your phone",
        situation: "A text message claims you've won a $5,000 gift card from a major retailer.",
        attackerMessage: "CONGRATULATIONS! You've been selected to receive a $5,000 Amazon Gift Card! You're one of only 100 winners nationwide. To claim your prize, click this link and verify your identity with your SSN and credit card info for shipping: bit.ly/win5000-claim",
        redFlags: ["Unsolicited prize notification", "Request for SSN and credit card", "Suspicious shortened URL", "Too good to be true offer"],
        safeActions: ["Delete the message immediately", "Report as spam", "Never click suspicious links"],
        riskyActions: ["Click the link to claim prize", "Provide SSN or credit card info", "Share the message with friends"],
        explanation: "Legitimate contests don't require personal financial information to claim prizes. Scammers use fake prize notifications to steal identity and financial information.",
        points: 100,
        icon: Gift
    },
    {
        id: 8,
        title: "Romance Scam on Dating App",
        type: 'romance',
        difficulty: 'medium',
        context: "You're chatting with someone on a dating platform",
        situation: "After a few weeks of chatting, your online romantic interest asks for financial help.",
        attackerMessage: "I've really enjoyed getting to know you these past weeks. I feel like we have a special connection. I'm so sorry to ask this, but I'm in a terrible situation. My mother is in the hospital and I need $2,000 for her surgery. I'll pay you back as soon as I can. Can you help me by sending money via Western Union?",
        redFlags: ["Never met in person", "Asks for money", "Emergency situation requiring immediate payment", "Uses wire transfer method"],
        safeActions: ["Refuse to send money", "Suggest meeting in person first", "Report the profile to the platform"],
        riskyActions: ["Send money via Western Union", "Give credit card information", "Provide personal financial details"],
        explanation: "Romance scammers build emotional connections over time before asking for money. Never send money to someone you haven't met in person, regardless of the story.",
        points: 125,
        icon: MessageSquare
    },
    {
        id: 9,
        title: "Fake Police Authority Call",
        type: 'authority',
        difficulty: 'hard',
        context: "You receive a phone call at home",
        situation: "Someone claiming to be a police officer calls about a missed court appearance.",
        attackerMessage: "This is Officer Johnson from the County Sheriff's Department. Our records show you failed to appear for jury duty and there's now a warrant for your arrest. To avoid being arrested today, you need to pay a $1,500 fine immediately. You can pay with gift cards or wire transfer. Do you want to handle this now or should we send officers to your location?",
        redFlags: ["Claims to be law enforcement", "Immediate payment demand", "Threatens arrest", "Requests gift cards or wire transfer"],
        safeActions: ["Hang up and call police directly", "Ask for badge number and verify", "Don't make any payments"],
        riskyActions: ["Pay with gift cards", "Provide personal information", "Wire money immediately"],
        explanation: "Police never call demanding immediate payment over the phone. Legitimate law enforcement issues are handled through official mail and in-person visits, not phone payments.",
        points: 175,
        icon: Shield
    },
    {
        id: 10,
        title: "Fake Public Wi-Fi Network",
        type: 'baiting',
        difficulty: 'medium',
        context: "You're at a coffee shop looking for Wi-Fi",
        situation: "You see a Wi-Fi network called 'Free_Coffee_Shop_WiFi' that doesn't require a password.",
        attackerMessage: "The network appears in your available connections list alongside the legitimate coffee shop Wi-Fi. It has a strong signal and connects immediately without asking for any password or terms of service acceptance.",
        redFlags: ["No password required", "Similar name to legitimate network", "Too convenient", "No official authentication process"],
        safeActions: ["Ask staff for official Wi-Fi name and password", "Use your mobile data instead", "Verify network with coffee shop employees"],
        riskyActions: ["Connect immediately without verification", "Enter personal information while connected", "Access sensitive accounts"],
        explanation: "Cybercriminals often set up fake Wi-Fi hotspots with names similar to legitimate businesses to intercept your data. Always verify the official network name with staff.",
        points: 150,
        icon: Wifi
    },
    {
        id: 11,
        title: "Credit Card Verification Scam",
        type: 'pretexting',
        difficulty: 'medium',
        context: "You receive a phone call about your credit card",
        situation: "Someone calls claiming to be from your credit card company's fraud department.",
        attackerMessage: "Hello, this is David from Visa Fraud Prevention. We've detected unusual activity on your card ending in 4567. Someone tried to make a $800 purchase in another state. To protect your account, I need to verify you're the real cardholder. Can you please confirm your full card number, expiration date, and the 3-digit security code on the back?",
        redFlags: ["Unsolicited call about fraud", "Asks for complete card details", "Pressure to act immediately", "Requests security code"],
        safeActions: ["Hang up and call the number on your card", "Check your account online independently", "Never give full card details over phone"],
        riskyActions: ["Provide full credit card information", "Give expiration date and CVV", "Follow caller's instructions"],
        explanation: "Credit card companies never call asking for your complete card information. They already have these details and use other methods to verify your identity.",
        points: 125,
        icon: CreditCard
    }
];

const SocialEngineeringSimulator = () => {
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [currentScenario, setCurrentScenario] = useState(0);
    const [showScenario, setShowScenario] = useState(false);
    const [scenarios] = useState(socialEngineeringScenarios.slice(0, 8)); // Use 8 scenarios for better gameplay
    const [userChoice, setUserChoice] = useState<string>('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [scenarioComplete, setScenarioComplete] = useState(false);
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);

    const startGame = () => {
        setGameStarted(true);
        setGameCompleted(false);
        setScore(0);
        setCurrentScenario(0);
        setShowScenario(true);
        setUserChoice('');
        setShowFeedback(false);
        setScenarioComplete(false);
        setLives(3);
        setStreak(0);
        toast.success("Social Engineering Defense Training Started!");
    };

    const generateChoices = (scenario: Scenario): Choice[] => {
        const choices: Choice[] = [];

        // Add 2 safe choices
        const safeChoices = scenario.safeActions.slice(0, 2);
        safeChoices.forEach((action, index) => {
            choices.push({
                id: index + 1,
                text: action,
                type: 'safe',
                explanation: "✅ Correct! This is the safe approach that protects you from social engineering.",
                points: scenario.points
            });
        });

        // Add 2 risky choices
        const riskyChoices = scenario.riskyActions.slice(0, 2);
        riskyChoices.forEach((action, index) => {
            choices.push({
                id: index + 3,
                text: action,
                type: 'risky',
                explanation: "❌ Dangerous! This action could compromise your security and help the attacker.",
                points: 0
            });
        });

        // Shuffle choices
        return choices.sort(() => Math.random() - 0.5);
    };

    const handleChoice = (choice: Choice) => {
        setUserChoice(choice.text);
        setShowFeedback(true);
        setScenarioComplete(true);

        if (choice.type === 'safe') {
            const bonusPoints = streak >= 2 ? choice.points * 0.2 : 0;
            const totalPoints = choice.points + bonusPoints;
            setScore(prev => prev + totalPoints);
            setStreak(prev => prev + 1);
            toast.success(`Correct! +${Math.round(totalPoints)} points ${bonusPoints > 0 ? `(+${Math.round(bonusPoints)} streak bonus!)` : ''}`);
        } else {
            setLives(prev => prev - 1);
            setStreak(0);
            toast.error("Incorrect! You fell for the social engineering attack. -1 life");

            if (lives <= 1) {
                toast.error("Game Over! You've been compromised too many times.");
                setTimeout(() => {
                    setGameCompleted(true);
                }, 2000);
                return;
            }
        }
    };

    const nextScenario = () => {
        if (currentScenario < scenarios.length - 1) {
            setCurrentScenario(prev => prev + 1);
            setShowFeedback(false);
            setScenarioComplete(false);
            setUserChoice('');
        } else {
            // Game completed successfully
            const streakBonus = streak * 50;
            const livesBonus = lives * 100;
            const finalScore = score + streakBonus + livesBonus;
            setScore(finalScore);
            toast.success(`Training Complete! Final Score: ${finalScore}`);
            setGameCompleted(true);
        }
    };

    const resetGame = () => {
        setGameStarted(false);
        setGameCompleted(false);
        setScore(0);
        setCurrentScenario(0);
        setShowScenario(false);
        setUserChoice('');
        setShowFeedback(false);
        setScenarioComplete(false);
        setLives(3);
        setStreak(0);
    };

    const getScenarioIcon = (type: string) => {
        switch (type) {
            case 'phishing': return Mail;
            case 'pretexting': return Phone;
            case 'baiting': return Target;
            case 'tailgating': return Building;
            case 'quid_pro_quo': return MessageSquare;
            case 'romance': return MessageSquare;
            case 'lottery': return Gift;
            case 'authority': return Shield;
            default: return Eye;
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'text-green-500 border-green-500';
            case 'medium': return 'text-yellow-500 border-yellow-500';
            case 'hard': return 'text-red-500 border-red-500';
            default: return 'text-muted-foreground border-muted';
        }
    };

    const scenario = scenarios[currentScenario];
    const choices = scenario ? generateChoices(scenario) : [];

    return (
        <GameLayout title="Social Engineering Simulator" score={score}>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center">
                    <Eye className="w-16 h-16 text-secondary mx-auto mb-4" />
                    <h2 className="text-3xl font-cyber font-bold mb-2 text-secondary">Social Engineering Defense Training</h2>
                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-6">
                        Learn to identify and defend against real-world social engineering attacks. Make the right choices to protect yourself and your organization.
                    </p>
                </div>

                {/* Game Stats */}
                {gameStarted && !gameCompleted && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <Card className="glass-card p-4 text-center">
                            <div className="text-xl font-cyber font-bold text-primary">{currentScenario + 1}/{scenarios.length}</div>
                            <div className="text-xs text-muted-foreground">Scenarios</div>
                        </Card>
                        <Card className="glass-card p-4 text-center">
                            <div className="flex justify-center space-x-1 mb-1">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-3 h-3 rounded-full ${i < lives ? 'bg-secondary' : 'bg-muted'
                                            }`}
                                    />
                                ))}
                            </div>
                            <div className="text-xs text-muted-foreground">Lives</div>
                        </Card>
                        <Card className="glass-card p-4 text-center">
                            <div className="text-xl font-cyber font-bold text-accent">{streak}</div>
                            <div className="text-xs text-muted-foreground">Streak</div>
                        </Card>
                        <Card className="glass-card p-4 text-center">
                            <div className="text-xl font-cyber font-bold text-secondary">{score}</div>
                            <div className="text-xs text-muted-foreground">Score</div>
                        </Card>
                    </div>
                )}

                {/* Scenario Display */}
                {gameStarted && !gameCompleted && scenario && (
                    <Card className="glass-card p-6">
                        <div className="space-y-6">
                            {/* Scenario Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <scenario.icon className="h-8 w-8 text-secondary" />
                                    <div>
                                        <h3 className="text-xl font-cyber font-bold text-secondary">{scenario.title}</h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Badge variant="outline" className="text-xs capitalize">
                                                {scenario.type.replace('_', ' ')}
                                            </Badge>
                                            <Badge variant="outline" className={`text-xs ${getDifficultyColor(scenario.difficulty)}`}>
                                                {scenario.difficulty}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Worth: {scenario.points} points
                                </div>
                            </div>

                            {/* Context */}
                            <div className="bg-card/50 p-4 rounded-lg border border-primary/20">
                                <h4 className="font-semibold text-primary mb-2">Situation</h4>
                                <p className="text-sm text-muted-foreground mb-3">{scenario.context}</p>
                                <p className="text-foreground">{scenario.situation}</p>
                            </div>

                            {/* Attacker Message */}
                            <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-lg">
                                <h4 className="font-semibold text-destructive mb-2 flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    The Message/Approach
                                </h4>
                                <div className="bg-card/70 p-3 rounded border border-destructive/20">
                                    <p className="text-sm italic">"{scenario.attackerMessage}"</p>
                                </div>
                            </div>

                            {/* Choices */}
                            {!showFeedback && (
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-primary">How do you respond?</h4>
                                    <div className="grid gap-3">
                                        {choices.map((choice) => (
                                            <Button
                                                key={choice.id}
                                                onClick={() => handleChoice(choice)}
                                                variant="outline"
                                                className="p-4 h-auto text-left justify-start border-muted hover:border-primary/50"
                                            >
                                                <div className="w-full">
                                                    <p className="text-sm">{choice.text}</p>
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Feedback */}
                            {showFeedback && (
                                <div className="space-y-4">
                                    <div className="bg-card/50 p-4 rounded-lg border border-accent/20">
                                        <h4 className="font-semibold text-accent mb-2">Your Choice:</h4>
                                        <p className="text-sm mb-3">"{userChoice}"</p>

                                        <div className="mb-4">
                                            {choices.find(c => c.text === userChoice)?.explanation}
                                        </div>

                                        <div className="bg-secondary/10 border border-secondary/30 p-3 rounded">
                                            <h5 className="font-semibold text-secondary mb-2">Learning Point:</h5>
                                            <p className="text-sm text-muted-foreground">{scenario.explanation}</p>
                                        </div>
                                    </div>

                                    {/* Red Flags and Safe Actions */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-destructive/10 border border-destructive/30 p-4 rounded">
                                            <h5 className="font-semibold text-destructive mb-2 flex items-center">
                                                <AlertTriangle className="h-4 w-4 mr-2" />
                                                Red Flags to Watch For:
                                            </h5>
                                            <ul className="space-y-1">
                                                {scenario.redFlags.map((flag, index) => (
                                                    <li key={index} className="text-xs text-muted-foreground">
                                                        • {flag}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-secondary/10 border border-secondary/30 p-4 rounded">
                                            <h5 className="font-semibold text-secondary mb-2 flex items-center">
                                                <Shield className="h-4 w-4 mr-2" />
                                                Safe Actions:
                                            </h5>
                                            <ul className="space-y-1">
                                                {scenario.safeActions.map((action, index) => (
                                                    <li key={index} className="text-xs text-muted-foreground">
                                                        • {action}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <Button onClick={nextScenario} className="cyber-button">
                                            {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'Complete Training'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                )}

                {/* Controls */}
                <div className="flex justify-center gap-4">
                    {!gameStarted ? (
                        <Button onClick={startGame} className="cyber-button text-lg py-3 px-8">
                            <Play className="w-5 h-5 mr-2" />
                            Start Training
                        </Button>
                    ) : null}

                    <Button onClick={resetGame} variant="outline" className="border-accent/50 text-accent hover:bg-accent/10">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset Training
                    </Button>
                </div>

                {/* Game Complete */}
                {gameCompleted && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <Card className="glass-card p-8 max-w-md mx-4">
                            <div className="text-center space-y-4">
                                {lives > 0 ? (
                                    <CheckCircle className="w-16 h-16 text-secondary mx-auto" />
                                ) : (
                                    <XCircle className="w-16 h-16 text-destructive mx-auto" />
                                )}

                                <h3 className="text-2xl font-cyber font-bold text-secondary">
                                    {lives > 0 ? 'Training Complete!' : 'Training Failed'}
                                </h3>

                                <div className="space-y-2">
                                    <p className="text-xl font-bold text-primary">
                                        Final Score: {score}
                                    </p>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p>Scenarios Completed: {lives > 0 ? scenarios.length : currentScenario}/{scenarios.length}</p>
                                        <p>Lives Remaining: {lives}/3</p>
                                        <p>Best Streak: {streak}</p>
                                        {lives > 0 && (
                                            <>
                                                <p>Lives Bonus: +{lives * 100}</p>
                                                <p>Streak Bonus: +{streak * 50}</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-secondary/10 border border-secondary/30 p-4 rounded">
                                    <p className="text-sm text-secondary font-semibold mb-1">
                                        {lives > 0
                                            ? '🎉 Excellent work! You successfully defended against social engineering attacks.'
                                            : '💡 Don\'t worry! Social engineering awareness takes practice. Try again!'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {lives > 0
                                            ? 'You\'ve learned to identify common attack patterns and respond appropriately.'
                                            : 'Review the red flags and safe actions to improve your defense skills.'}
                                    </p>
                                </div>

                                <Button onClick={resetGame} className="cyber-button w-full">
                                    {lives > 0 ? 'New Training Session' : 'Try Again'}
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Instructions */}
                {!gameStarted && (
                    <Card className="glass-card p-8 max-w-4xl mx-auto">
                        <h3 className="text-xl font-cyber font-bold text-secondary mb-6">
                            Social Engineering Defense Training - Extended Edition
                        </h3>

                        <div className="grid md:grid-cols-2 gap-8 text-sm">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Phone className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Pretexting & Authority Scams</p>
                                        <p className="text-muted-foreground">Fake IT support, police calls, and credit card verification attempts</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Phishing & Digital Deception</p>
                                        <p className="text-muted-foreground">Malicious emails, fake job offers, and suspicious links</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Target className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Baiting & Physical Threats</p>
                                        <p className="text-muted-foreground">USB drives, fake Wi-Fi networks, and tailgating attempts</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Gift className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Prize & Romance Scams</p>
                                        <p className="text-muted-foreground">Fake lottery wins and online relationship manipulation</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Verification Techniques</p>
                                        <p className="text-muted-foreground">Learn to verify identity through official channels</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Red Flag Recognition</p>
                                        <p className="text-muted-foreground">Identify common warning signs across all attack types</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Incident Response</p>
                                        <p className="text-muted-foreground">Proper reporting and recovery procedures</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Eye className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Advanced Awareness</p>
                                        <p className="text-muted-foreground">Complex multi-stage attacks and psychological manipulation</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 mt-6">
                            <p className="text-sm text-secondary font-semibold mb-2">🎯 Enhanced Training Features</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• 11 diverse social engineering scenarios covering all major attack types</li>
                                <li>• Real-world situations including romance, lottery, and authority scams</li>
                                <li>• Progressive difficulty from basic phishing to complex pretexting</li>
                                <li>• Interactive decision-making with immediate educational feedback</li>
                                <li>• Comprehensive red flag identification training</li>
                                <li>• Lives system encourages careful analysis of each scenario</li>
                                <li>• Streak bonuses reward consistent security awareness</li>
                            </ul>
                        </div>
                    </Card>
                )}
            </div>
        </GameLayout>
    );
};

export default SocialEngineeringSimulator;
