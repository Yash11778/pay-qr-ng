import React, { useState } from 'react';
import { CreditCard, Wallet, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface PaymentStep {
  id: number;
  title: string;
  status: 'pending' | 'active' | 'completed';
}

interface XLMTransaction {
  id: string;
  hash: string;
  amount: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
}

export default function PaymentFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [xlmAmount, setXlmAmount] = useState('145.67');
  const [walletAddress, setWalletAddress] = useState('');
  const [transaction, setTransaction] = useState<XLMTransaction | null>(null);
  const { toast } = useToast();

  const steps: PaymentStep[] = [
    { id: 1, title: 'Invoice Review', status: currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending' },
    { id: 2, title: 'Payment Details', status: currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'pending' },
    { id: 3, title: 'XLM Transfer', status: currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : 'pending' },
    { id: 4, title: 'Confirmation', status: currentStep === 4 ? 'active' : 'pending' },
  ];

  const selectedInvoice = {
    number: 'INV-001',
    amount: '₦125,000',
    client: 'Techpoint Africa',
    dueDate: '2024-01-30',
    gstNumber: '12ABCDE1234F1Z5',
    description: 'Software Development Services'
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePayment = () => {
    const newTransaction: XLMTransaction = {
      id: 'TXN-' + Math.random().toString(36).substr(2, 9),
      hash: 'stellar_' + Math.random().toString(36).substr(2, 12),
      amount: xlmAmount,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    
    setTransaction(newTransaction);
    setCurrentStep(4);
    
    // Simulate transaction confirmation
    setTimeout(() => {
      setTransaction(prev => prev ? { ...prev, status: 'confirmed' } : null);
      toast({
        title: "Payment Successful!",
        description: "XLM payment has been confirmed on Stellar network.",
      });
    }, 3000);
  };

  const StepIndicator = ({ step }: { step: PaymentStep }) => {
    const getStepColor = () => {
      switch (step.status) {
        case 'completed': return 'bg-success text-success-foreground';
        case 'active': return 'bg-primary text-primary-foreground';
        default: return 'bg-muted text-muted-foreground';
      }
    };

    return (
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepColor()}`}>
          {step.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : step.id}
        </div>
        <span className={`ml-3 text-sm font-medium ${step.status === 'active' ? 'text-foreground' : 'text-muted-foreground'}`}>
          {step.title}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">XLM Payment Flow</h1>
        <p className="text-muted-foreground">Process invoice payments using Stellar Lumens (XLM)</p>
      </div>

      {/* Progress Steps */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <StepIndicator step={step} />
                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-4 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {currentStep === 1 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Invoice Review</CardTitle>
                <CardDescription>Review invoice details before payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Invoice Number</Label>
                    <p className="font-medium">{selectedInvoice.number}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Amount</Label>
                    <p className="font-medium text-lg">{selectedInvoice.amount}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Client</Label>
                  <p className="font-medium">{selectedInvoice.client}</p>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="text-sm">{selectedInvoice.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Due Date</Label>
                    <p className="font-medium">{selectedInvoice.dueDate}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">GST Number</Label>
                    <p className="font-medium font-mono text-sm">{selectedInvoice.gstNumber}</p>
                  </div>
                </div>
                
                <Button onClick={handleNext} className="w-full bg-gradient-primary hover:opacity-90">
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Configure XLM payment settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="xlmAmount">XLM Amount</Label>
                  <Input
                    id="xlmAmount"
                    value={xlmAmount}
                    onChange={(e) => setXlmAmount(e.target.value)}
                    placeholder="145.67"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    ≈ {selectedInvoice.amount} (Current rate: 1 XLM = ₦858.42)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="walletAddress">Recipient Wallet Address</Label>
                  <Input
                    id="walletAddress"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="GCXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Invoice Amount:</span>
                      <span>{selectedInvoice.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>XLM Amount:</span>
                      <span>{xlmAmount} XLM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network Fee:</span>
                      <span>0.00001 XLM</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total XLM:</span>
                      <span>{(parseFloat(xlmAmount) + 0.00001).toFixed(5)} XLM</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleNext} className="w-full bg-gradient-primary hover:opacity-90">
                  Continue to Transfer
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>XLM Transfer</CardTitle>
                <CardDescription>Initiate Stellar Lumens payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-warning-light p-4 rounded-lg border border-warning/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                    <div>
                      <p className="font-medium text-warning-foreground">Confirm Payment Details</p>
                      <p className="text-sm text-warning-foreground/80 mt-1">
                        Please verify all details before confirming. XLM transactions cannot be reversed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm">Recipient:</span>
                    <span className="text-sm font-mono">GC...{walletAddress.slice(-6) || 'XXXXXX'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm">Amount:</span>
                    <span className="text-sm font-medium">{xlmAmount} XLM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm">Memo:</span>
                    <span className="text-sm">Invoice {selectedInvoice.number}</span>
                  </div>
                </div>

                <Button onClick={handlePayment} className="w-full bg-gradient-primary hover:opacity-90">
                  Confirm XLM Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Payment Confirmation</CardTitle>
                <CardDescription>XLM transaction status and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {transaction && (
                  <>
                    <div className="text-center py-6">
                      {transaction.status === 'pending' && (
                        <div className="flex flex-col items-center">
                          <Clock className="w-16 h-16 text-warning mb-4 animate-pulse" />
                          <h3 className="text-lg font-medium">Transaction Pending</h3>
                          <p className="text-sm text-muted-foreground">Waiting for network confirmation...</p>
                        </div>
                      )}
                      
                      {transaction.status === 'confirmed' && (
                        <div className="flex flex-col items-center">
                          <CheckCircle className="w-16 h-16 text-success mb-4" />
                          <h3 className="text-lg font-medium text-success">Payment Successful!</h3>
                          <p className="text-sm text-muted-foreground">Transaction confirmed on Stellar network</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm">Transaction ID:</span>
                        <span className="text-sm font-mono">{transaction.id}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm">Stellar Hash:</span>
                        <span className="text-sm font-mono">{transaction.hash}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm">Amount:</span>
                        <span className="text-sm font-medium">{transaction.amount} XLM</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm">Status:</span>
                        <Badge className={transaction.status === 'confirmed' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>

                    {transaction.status === 'confirmed' && (
                      <Button className="w-full" variant="outline">
                        View on Stellar Explorer
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                XLM Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Available Balance</p>
                  <p className="text-2xl font-bold">2,847.52 XLM</p>
                  <p className="text-sm text-muted-foreground">≈ ₦2,445,180</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Full Wallet
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Exchange Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">1 XLM</span>
                  <span className="text-sm font-medium">₦858.42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">1 USD</span>
                  <span className="text-sm font-medium">₦1,620.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">XLM/USD</span>
                  <span className="text-sm font-medium">$0.53</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: 2 minutes ago
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}