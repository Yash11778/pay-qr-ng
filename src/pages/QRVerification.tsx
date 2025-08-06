import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, Upload, CheckCircle, X, Scan } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

interface VerificationResult {
  isValid: boolean;
  invoiceData?: {
    invoiceNumber: string;
    amount: string;
    gstNumber: string;
    clientName: string;
    issueDate: string;
    status: 'verified' | 'invalid' | 'expired';
  };
  error?: string;
}

export default function QRVerification() {
  const [isScanning, setIsScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Generate sample QR code for demo
  useEffect(() => {
    const generateQR = async () => {
      const sampleInvoiceData = {
        invoiceNumber: 'INV-001',
        amount: '125000',
        gstNumber: '12ABCDE1234F1Z5',
        clientName: 'Techpoint Africa',
        issueDate: '2024-01-15',
        hash: 'abc123def456'
      };
      
      try {
        const qr = await QRCode.toDataURL(JSON.stringify(sampleInvoiceData));
        setQrCodeUrl(qr);
      } catch (err) {
        console.error(err);
      }
    };
    
    generateQR();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to scan QR codes.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const simulateQRScan = () => {
    // Simulate successful QR scan
    const mockResult: VerificationResult = {
      isValid: true,
      invoiceData: {
        invoiceNumber: 'INV-001',
        amount: '₦125,000',
        gstNumber: '12ABCDE1234F1Z5',
        clientName: 'Techpoint Africa',
        issueDate: '2024-01-15',
        status: 'verified'
      }
    };
    
    setVerificationResult(mockResult);
    stopCamera();
    
    toast({
      title: "QR Code Verified!",
      description: "Invoice has been successfully verified.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate QR code reading from image
      setTimeout(() => {
        simulateQRScan();
      }, 1000);
    }
  };

  const resetVerification = () => {
    setVerificationResult(null);
    stopCamera();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">QR Code Verification</h1>
        <p className="text-muted-foreground">Scan or upload QR codes to verify invoice authenticity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Scanner */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>
              Use your camera to scan invoice QR codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isScanning && !verificationResult && (
              <div className="space-y-4">
                <div className="flex flex-col items-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <Camera className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Scan QR Code</p>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Point your camera at the QR code on the invoice
                  </p>
                  <Button onClick={startCamera} className="bg-gradient-primary hover:opacity-90">
                    <Scan className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">Or upload an image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="qr-upload"
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="qr-upload" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload QR Image
                    </label>
                  </Button>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg"
                  />
                  <div className="absolute inset-0 border-4 border-primary rounded-lg opacity-50"></div>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={simulateQRScan} className="flex-1">
                    Simulate Scan
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {verificationResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-center p-6 bg-success-light rounded-lg">
                  <CheckCircle className="w-12 h-12 text-success mr-4" />
                  <div>
                    <p className="text-lg font-medium text-success">Verification Successful</p>
                    <p className="text-sm text-success/80">Invoice is authentic and valid</p>
                  </div>
                </div>
                <Button variant="outline" onClick={resetVerification} className="w-full">
                  Scan Another QR Code
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Result */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Verification Result
            </CardTitle>
            <CardDescription>
              Invoice details and verification status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!verificationResult ? (
              <div className="flex flex-col items-center p-8 text-center">
                <QrCode className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No QR Code Scanned</p>
                <p className="text-sm text-muted-foreground">
                  Scan a QR code to see verification results here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {verificationResult.isValid && verificationResult.invoiceData && (
                  <>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Invoice Details</h4>
                      <Badge className="bg-success text-success-foreground">
                        Verified
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Invoice Number</p>
                          <p className="font-medium">{verificationResult.invoiceData.invoiceNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="font-medium">{verificationResult.invoiceData.amount}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Client Name</p>
                        <p className="font-medium">{verificationResult.invoiceData.clientName}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">GST Number</p>
                        <p className="font-medium font-mono text-sm">{verificationResult.invoiceData.gstNumber}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">Issue Date</p>
                        <p className="font-medium">{verificationResult.invoiceData.issueDate}</p>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-primary hover:opacity-90">
                      Process Payment
                    </Button>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sample QR Code */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Sample QR Code</CardTitle>
          <CardDescription>
            Use this QR code for testing the scanner functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            {qrCodeUrl && (
              <img src={qrCodeUrl} alt="Sample QR Code" className="w-32 h-32" />
            )}
            <div className="space-y-2">
              <p className="font-medium">Test Invoice Data:</p>
              <p className="text-sm text-muted-foreground">Invoice: INV-001</p>
              <p className="text-sm text-muted-foreground">Amount: ₦125,000</p>
              <p className="text-sm text-muted-foreground">Client: Techpoint Africa</p>
              <p className="text-sm text-muted-foreground">GST: 12ABCDE1234F1Z5</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}