import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function AgeGateModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("edgeguide-age-accepted");
    if (!hasAccepted) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("edgeguide-age-accepted", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Age & Responsibility Notice</DialogTitle>
          </div>
          <DialogDescription className="space-y-3 text-left">
            <p>
              <strong>EdgeGuide</strong> provides sports betting analysis and
              data for <strong>informational purposes only</strong>.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>You must be 21+ years old to use this service</li>
              <li>We do not facilitate wagering or accept bets</li>
              <li>All odds data is for analysis only</li>
              <li>Gamble responsibly — never bet more than you can afford</li>
              <li>If you need help: 1-800-GAMBLER</li>
            </ul>
            <p className="text-xs text-muted-foreground">
              By continuing, you confirm you meet the age requirements and
              understand this is an analytical tool, not a gambling platform.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleAccept} className="w-full">
            I Understand & Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
