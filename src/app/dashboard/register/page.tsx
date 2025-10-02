'use client';

import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerDevice } from '@/lib/actions';
import { FilePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export default function RegisterDevicePage() {
  const initialState = { error: '' };
  const [state, dispatch] = useFormState(registerDevice, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: state.error,
      })
    }
  }, [state, toast]);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilePlus className="text-primary" />
            Register a New Device
          </CardTitle>
          <CardDescription>
            Enter the device's manufacturing details to create its digital
            passport on the blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                name="serialNumber"
                placeholder="Unique device identifier (e.g., IMEI, SN)"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                name="manufacturer"
                placeholder="e.g., Apple, Samsung, Dell"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                name="model"
                placeholder="e.g., iPhone 15 Pro, Galaxy S24 Ultra"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturingDate">Manufacturing Date</Label>''
              <Input id="manufacturingDate" name="manufacturingDate" type="date" required />
            </div>
            <Button type="submit" className="w-full" variant="default">
              Create Passport
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
