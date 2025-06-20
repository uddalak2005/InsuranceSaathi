import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Clock, FileText, Download, Search } from "lucide-react";

interface ClaimRecord {
  id: string;
  type: string;
  status: string;
  amount: number;
  submittedDate: string;
  settledDate?: string;
  settlementAmount?: number;
}

const ClaimRecords = () => {
  const claimHistory: ClaimRecord[] = [
    {
      id: "CLM-2024-001",
      type: "Auto Accident",
      status: "under-review",
      amount: 2500,
      submittedDate: "2024-01-15"
    },
    {
      id: "CLM-2024-002",
      type: "Medical",
      status: "accepted",
      amount: 1800,
      submittedDate: "2024-01-10",
      settledDate: "2024-01-18",
      settlementAmount: 1800
    },
    {
      id: "CLM-2023-089",
      type: "Property Damage",
      status: "accepted",
      amount: 3200,
      submittedDate: "2023-12-05",
      settledDate: "2023-12-20",
      settlementAmount: 2800
    },
    {
      id: "CLM-2023-078",
      type: "Theft",
      status: "rejected",
      amount: 1500,
      submittedDate: "2023-11-20"
    },
    {
      id: "CLM-2023-067",
      type: "Auto Accident",
      status: "accepted",
      amount: 4500,
      submittedDate: "2023-10-15",
      settledDate: "2023-11-01",
      settlementAmount: 4200
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "under-review":
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "under-review":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const totalClaims = claimHistory.length;
  const acceptedClaims = claimHistory.filter(claim => claim.status === "accepted").length;
  const totalSettled = claimHistory
    .filter(claim => claim.settlementAmount)
    .reduce((sum, claim) => sum + (claim.settlementAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{totalClaims}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Claims</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{acceptedClaims}</div>
            <p className="text-xs text-muted-foreground">
              {((acceptedClaims / totalClaims) * 100).toFixed(0)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Settled</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              ${totalSettled.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime settlements</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Claims History</CardTitle>
          <CardDescription>
            Complete record of all your submitted insurance claims
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search claims by ID or type..." 
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="auto">Auto Accident</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="property">Property Damage</SelectItem>
                <SelectItem value="theft">Theft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Claims Table */}
          <div className="space-y-4">
            {claimHistory.map((claim) => (
              <div key={claim.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(claim.status)}
                    <div>
                      <p className="font-medium">{claim.id}</p>
                      <p className="text-sm text-gray-500">{claim.type}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(claim.status)}>
                    {claim.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Submitted</p>
                    <p className="font-medium">{claim.submittedDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Claimed Amount</p>
                    <p className="font-medium">${claim.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Settled Amount</p>
                    <p className="font-medium">
                      {claim.settlementAmount 
                        ? `$${claim.settlementAmount.toLocaleString()}`
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Settled Date</p>
                    <p className="font-medium">{claim.settledDate || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  {claim.status === "rejected" && (
                    <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
                      Appeal Claim
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimRecords;