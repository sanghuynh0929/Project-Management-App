
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface EpicCostViewProps {
  epicId: number;
}

// Mock cost data for epic
const mockEpicCostData = [
  {
    costName: "Development Tools License",
    category: "Software",
    amount: 2500,
    workItems: ["Authentication API", "Login Form Integration"]
  },
  {
    costName: "UI Design Software",
    category: "Software", 
    amount: 800,
    workItems: ["Login Form Design"]
  },
  {
    costName: "Security Audit",
    category: "Consulting",
    amount: 5000,
    workItems: ["Authentication API", "Password Reset Flow"]
  },
  {
    costName: "Testing Infrastructure",
    category: "Infrastructure",
    amount: 1200,
    workItems: ["Authentication Testing"]
  },
  {
    costName: "SSL Certificates",
    category: "Infrastructure",
    amount: 300,
    workItems: ["Authentication API"]
  }
];

const EpicCostView: React.FC<EpicCostViewProps> = ({ epicId }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Software': return 'bg-blue-100 text-blue-800';
      case 'Consulting': return 'bg-purple-100 text-purple-800';
      case 'Infrastructure': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalCost = mockEpicCostData.reduce((sum, cost) => sum + cost.amount, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Epic Cost Analysis</h1>
        <p className="text-gray-600">Track costs and expenses for this epic</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cost Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Associated Work Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEpicCostData.map((cost, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{cost.costName}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(cost.category)}>
                      {cost.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      ${cost.amount.toLocaleString()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {cost.workItems.map((workItem, workItemIndex) => (
                        <Badge key={workItemIndex} variant="secondary" className="text-xs">
                          {workItem}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Epic Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${totalCost.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Software Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${mockEpicCostData.filter(c => c.category === 'Software').reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Consulting Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${mockEpicCostData.filter(c => c.category === 'Consulting').reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Infrastructure Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${mockEpicCostData.filter(c => c.category === 'Infrastructure').reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EpicCostView;
