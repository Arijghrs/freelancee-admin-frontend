import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const [commission, setCommission] = useState("10");
  const [minWithdrawal, setMinWithdrawal] = useState("50");
  const [currency, setCurrency] = useState("TND");
  const [autoRelease, setAutoRelease] = useState("14");
  const [maintenance, setMaintenance] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: "Settings saved", description: "Platform settings have been updated." });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm">Configure platform-wide settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">Financial Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Commission Rate (%)</Label>
              <Input type="number" value={commission} onChange={(e) => setCommission(e.target.value)} />
              <p className="text-xs text-muted-foreground">Percentage taken from each transaction</p>
            </div>
            <div className="space-y-2">
              <Label>Minimum Withdrawal ({currency})</Label>
              <Input type="number" value={minWithdrawal} onChange={(e) => setMinWithdrawal(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Platform Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TND">TND - Tunisian Dinar</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Auto-release Escrow (days)</Label>
              <Input type="number" value={autoRelease} onChange={(e) => setAutoRelease(e.target.value)} />
              <p className="text-xs text-muted-foreground">Days after submission to auto-release funds if no action</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">Platform Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">Temporarily disable the platform</p>
              </div>
              <Switch checked={maintenance} onCheckedChange={setMaintenance} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90">
        Save Settings
      </Button>
    </div>
  );
};

export default AdminSettings;
