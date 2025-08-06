import React from 'react';
import { Upload, Eye, CreditCard, TrendingUp, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const DashboardCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend 
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: string;
}) => (
  <Card className="relative overflow-hidden bg-gradient-card border-0 shadow-card hover:shadow-md transition-all duration-300 animate-scale-in">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <Badge variant="secondary" className="text-xs">
            {trend}
          </Badge>
        )}
      </div>
    </CardContent>
  </Card>
);

const RecentInvoice = ({ 
  id, 
  amount, 
  status, 
  date, 
  client 
}: {
  id: string;
  amount: string;
  status: 'paid' | 'pending' | 'verified';
  date: string;
  client: string;
}) => {
  const statusConfig = {
    paid: { color: 'bg-success text-success-foreground', label: 'Paid' },
    pending: { color: 'bg-warning text-warning-foreground', label: 'Pending' },
    verified: { color: 'bg-primary text-primary-foreground', label: 'Verified' },
  };

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <div>
            <p className="font-medium text-sm">Invoice #{id}</p>
            <p className="text-xs text-muted-foreground">{client}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-medium text-sm">₦{amount}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
        <Badge className={statusConfig[status].color}>
          {statusConfig[status].label}
        </Badge>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const recentInvoices = [
    { id: 'INV-001', amount: '125,000', status: 'paid' as const, date: '2024-01-15', client: 'Techpoint Africa' },
    { id: 'INV-002', amount: '89,500', status: 'pending' as const, date: '2024-01-14', client: 'Flutterwave' },
    { id: 'INV-003', amount: '156,800', status: 'verified' as const, date: '2024-01-13', client: 'Paystack' },
    { id: 'INV-004', amount: '67,200', status: 'paid' as const, date: '2024-01-12', client: 'Andela' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Manage your GST invoices and payments</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link to="/verify">
              <Eye className="w-4 h-4 mr-2" />
              Verify Invoice
            </Link>
          </Button>
          <Button asChild className="bg-gradient-primary hover:opacity-90">
            <Link to="/upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload Invoice
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Invoices"
          value="1,234"
          description="All time invoices"
          icon={FileText}
          trend="+12%"
        />
        <DashboardCard
          title="Verified Invoices"
          value="892"
          description="QR code verified"
          icon={CheckCircle}
          trend="+8%"
        />
        <DashboardCard
          title="Total Revenue"
          value="₦5.2M"
          description="This month"
          icon={TrendingUp}
          trend="+24%"
        />
        <DashboardCard
          title="XLM Balance"
          value="1,847 XLM"
          description="≈ ₦892,650"
          icon={CreditCard}
          trend="+5.6%"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Invoices
            </CardTitle>
            <CardDescription>Latest invoice submissions and verifications</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {recentInvoices.map((invoice) => (
              <RecentInvoice key={invoice.id} {...invoice} />
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload New Invoice
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/verify">
                <Eye className="w-4 h-4 mr-2" />
                Verify with QR Code
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/payments">
                <CreditCard className="w-4 h-4 mr-2" />
                Process Payment
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/wallet">
                <TrendingUp className="w-4 h-4 mr-2" />
                View XLM Wallet
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}