import React, { useState } from 'react';
import { History, Filter, Download, Search, Calendar, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Transaction {
  id: string;
  invoiceNumber: string;
  type: 'invoice' | 'payment' | 'verification';
  amount: string;
  xlmAmount?: string;
  status: 'completed' | 'pending' | 'failed' | 'verified';
  date: string;
  client: string;
  method: 'XLM' | 'Bank Transfer' | 'QR Verification';
  hash?: string;
}

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const transactions: Transaction[] = [
    {
      id: 'TXN-001',
      invoiceNumber: 'INV-001',
      type: 'payment',
      amount: '₦125,000',
      xlmAmount: '145.67 XLM',
      status: 'completed',
      date: '2024-01-15 14:30',
      client: 'Techpoint Africa',
      method: 'XLM',
      hash: 'stellar_abc123def456'
    },
    {
      id: 'TXN-002',
      invoiceNumber: 'INV-002',
      type: 'verification',
      amount: '₦89,500',
      status: 'verified',
      date: '2024-01-14 16:45',
      client: 'Flutterwave',
      method: 'QR Verification'
    },
    {
      id: 'TXN-003',
      invoiceNumber: 'INV-003',
      type: 'invoice',
      amount: '₦156,800',
      status: 'pending',
      date: '2024-01-13 11:20',
      client: 'Paystack',
      method: 'Bank Transfer'
    },
    {
      id: 'TXN-004',
      invoiceNumber: 'INV-004',
      type: 'payment',
      amount: '₦67,200',
      xlmAmount: '78.32 XLM',
      status: 'completed',
      date: '2024-01-12 09:15',
      client: 'Andela',
      method: 'XLM',
      hash: 'stellar_def789ghi012'
    },
    {
      id: 'TXN-005',
      invoiceNumber: 'INV-005',
      type: 'verification',
      amount: '₦234,500',
      status: 'failed',
      date: '2024-01-11 13:50',
      client: 'Kuda Bank',
      method: 'QR Verification'
    },
    {
      id: 'TXN-006',
      invoiceNumber: 'INV-006',
      type: 'payment',
      amount: '₦178,900',
      xlmAmount: '208.45 XLM',
      status: 'pending',
      date: '2024-01-10 08:30',
      client: 'Carbon',
      method: 'XLM'
    }
  ];

  const getStatusConfig = (status: string) => {
    const configs = {
      completed: { className: 'bg-success text-success-foreground', label: 'Completed' },
      pending: { className: 'bg-warning text-warning-foreground', label: 'Pending' },
      failed: { className: 'bg-destructive text-destructive-foreground', label: 'Failed' },
      verified: { className: 'bg-primary text-primary-foreground', label: 'Verified' },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getTypeConfig = (type: string) => {
    const configs = {
      invoice: { icon: '📄', label: 'Invoice', color: 'text-blue-600' },
      payment: { icon: '💰', label: 'Payment', color: 'text-green-600' },
      verification: { icon: '✅', label: 'Verification', color: 'text-purple-600' },
    };
    return configs[type as keyof typeof configs] || configs.invoice;
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleExport = () => {
    // Simulate export functionality
    console.log('Exporting transactions...');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
          <p className="text-muted-foreground">Track all your invoices, payments, and verifications</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">₦1,852,900</p>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <span className="text-lg">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">847.89 XLM</p>
                <p className="text-xs text-muted-foreground">XLM Processed</p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-lg">⭐</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-muted-foreground">Invoices</p>
              </div>
              <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                <span className="text-lg">📄</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <span className="text-lg">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search transactions, invoices, clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="verification">Verification</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Transactions
          </CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => setSortBy('id')}>
                  <div className="flex items-center gap-1">
                    Transaction ID
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="cursor-pointer" onClick={() => setSortBy('date')}>
                  <div className="flex items-center gap-1">
                    Date
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => {
                const statusConfig = getStatusConfig(transaction.status);
                const typeConfig = getTypeConfig(transaction.type);
                
                return (
                  <TableRow key={transaction.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium font-mono text-sm">
                      {transaction.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{typeConfig.icon}</span>
                        <span className={`text-sm font-medium ${typeConfig.color}`}>
                          {typeConfig.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.invoiceNumber}
                    </TableCell>
                    <TableCell>{transaction.client}</TableCell>
                    <TableCell className="text-right">
                      <div>
                        <p className="font-medium">{transaction.amount}</p>
                        {transaction.xlmAmount && (
                          <p className="text-xs text-muted-foreground">{transaction.xlmAmount}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {transaction.method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig.className}>
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {transaction.date}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}