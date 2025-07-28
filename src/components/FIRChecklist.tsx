/**
 * FIR Checklist Modal Component
 * Generate and manage FIR checklists based on legal sections
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Download,
  Printer,
  User,
  MapPin,
  Calendar,
  Scale,
  Camera
} from 'lucide-react';

interface FIRChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSection?: any;
}

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  mandatory: boolean;
  completed: boolean;
  notes?: string;
}

export const FIRChecklist: React.FC<FIRChecklistProps> = ({ 
  isOpen, 
  onClose,
  selectedSection 
}) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // Complainant Details
    {
      id: '1',
      category: 'Complainant Details',
      item: 'Full name, address, and contact details of complainant',
      mandatory: true,
      completed: false
    },
    {
      id: '2',
      category: 'Complainant Details',
      item: 'Identity proof (Aadhaar, PAN, Voter ID, etc.)',
      mandatory: true,
      completed: false
    },
    {
      id: '3',
      category: 'Complainant Details',
      item: 'Relationship to the incident (victim, witness, etc.)',
      mandatory: true,
      completed: false
    },

    // Incident Details
    {
      id: '4',
      category: 'Incident Details',
      item: 'Date and time of incident',
      mandatory: true,
      completed: false
    },
    {
      id: '5',
      category: 'Incident Details',
      item: 'Exact location of incident with landmarks',
      mandatory: true,
      completed: false
    },
    {
      id: '6',
      category: 'Incident Details',
      item: 'Detailed description of the incident',
      mandatory: true,
      completed: false
    },
    {
      id: '7',
      category: 'Incident Details',
      item: 'Names and details of accused persons (if known)',
      mandatory: false,
      completed: false
    },

    // Evidence & Witnesses
    {
      id: '8',
      category: 'Evidence & Witnesses',
      item: 'List of witnesses with contact details',
      mandatory: false,
      completed: false
    },
    {
      id: '9',
      category: 'Evidence & Witnesses',
      item: 'Physical evidence or documents related to case',
      mandatory: false,
      completed: false
    },
    {
      id: '10',
      category: 'Evidence & Witnesses',
      item: 'Photographs or videos (if available)',
      mandatory: false,
      completed: false
    },

    // Legal Provisions
    {
      id: '11',
      category: 'Legal Provisions',
      item: 'Applicable sections of BNS/IPC',
      mandatory: true,
      completed: false
    },
    {
      id: '12',
      category: 'Legal Provisions',
      item: 'Cognizable or Non-cognizable offence classification',
      mandatory: true,
      completed: false
    }
  ]);

  const [firNotes, setFirNotes] = useState('');

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addNotes = (id: string, notes: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, notes } : item
    ));
  };

  const getCompletionStats = () => {
    const mandatory = checklist.filter(item => item.mandatory);
    const mandatoryCompleted = mandatory.filter(item => item.completed);
    const optional = checklist.filter(item => !item.mandatory);
    const optionalCompleted = optional.filter(item => item.completed);
    
    return {
      mandatory: `${mandatoryCompleted.length}/${mandatory.length}`,
      optional: `${optionalCompleted.length}/${optional.length}`,
      total: `${mandatoryCompleted.length + optionalCompleted.length}/${checklist.length}`,
      mandatoryComplete: mandatoryCompleted.length === mandatory.length
    };
  };

  const stats = getCompletionStats();

  const categories = [...new Set(checklist.map(item => item.category))];

  const generateFIRNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `FIR/${year}/${random}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pt-sans text-foreground flex items-center">
            <FileText className="w-6 h-6 mr-2 text-green" />
            FIR Checklist
            {selectedSection && (
              <Badge variant="outline" className="ml-3">
                BNS Section {selectedSection.section}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Stats Panel */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-gradient-to-br from-green/5 to-saffron/5 border-green/20">
              <h3 className="font-pt-sans font-semibold text-foreground mb-4 flex items-center">
                <Scale className="w-4 h-4 mr-2" />
                FIR Status
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">FIR Number:</span>
                  <Badge variant="outline" className="font-mono">
                    {generateFIRNumber()}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Mandatory Items:</span>
                    <Badge 
                      variant={stats.mandatoryComplete ? "default" : "destructive"}
                      className={stats.mandatoryComplete ? "bg-green text-white" : ""}
                    >
                      {stats.mandatory}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Optional Items:</span>
                    <Badge variant="secondary">
                      {stats.optional}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Progress:</span>
                    <Badge variant="outline">
                      {stats.total}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {selectedSection && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Applicable Section:
                    </h4>
                    <div className="text-sm space-y-1">
                      <div className="font-medium">BNS {selectedSection.section}</div>
                      <div className="text-muted-foreground">{selectedSection.title}</div>
                      <Badge variant="outline" className="text-xs">
                        {selectedSection.punishment}
                      </Badge>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="btn-ripple focus-ring flex-1"
                    disabled={!stats.mandatoryComplete}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="btn-ripple focus-ring flex-1"
                    disabled={!stats.mandatoryComplete}
                  >
                    <Printer className="w-3 h-3 mr-1" />
                    Print
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Card className="p-3 text-center">
                <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-success" />
                <div className="text-xs text-muted-foreground">Completed</div>
                <div className="text-sm font-semibold">
                  {checklist.filter(item => item.completed).length}
                </div>
              </Card>
              
              <Card className="p-3 text-center">
                <Clock className="w-4 h-4 mx-auto mb-1 text-warning" />
                <div className="text-xs text-muted-foreground">Pending</div>
                <div className="text-sm font-semibold">
                  {checklist.filter(item => !item.completed).length}
                </div>
              </Card>
              
              <Card className="p-3 text-center">
                <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-destructive" />
                <div className="text-xs text-muted-foreground">Critical</div>
                <div className="text-sm font-semibold">
                  {checklist.filter(item => item.mandatory && !item.completed).length}
                </div>
              </Card>
            </div>
          </div>

          {/* Checklist Panel */}
          <div className="lg:col-span-2">
            <ScrollArea className="h-[600px]">
              <div className="space-y-6">
                {categories.map(category => (
                  <div key={category}>
                    <h3 className="text-lg font-pt-sans font-semibold text-foreground mb-3 flex items-center">
                      {category === 'Complainant Details' && <User className="w-4 h-4 mr-2" />}
                      {category === 'Incident Details' && <MapPin className="w-4 h-4 mr-2" />}
                      {category === 'Evidence & Witnesses' && <Camera className="w-4 h-4 mr-2" />}
                      {category === 'Legal Provisions' && <Scale className="w-4 h-4 mr-2" />}
                      {category}
                    </h3>
                    
                    <div className="space-y-3">
                      {checklist.filter(item => item.category === category).map(item => (
                        <Card key={item.id} className="p-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              checked={item.completed}
                              onCheckedChange={() => toggleItem(item.id)}
                              className="mt-1"
                              aria-label={`Mark "${item.item}" as completed`}
                            />
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <p className={`text-sm ${
                                  item.completed 
                                    ? 'line-through text-muted-foreground' 
                                    : 'text-foreground'
                                }`}>
                                  {item.item}
                                </p>
                                
                                {item.mandatory && (
                                  <Badge variant="outline" className="ml-2 text-destructive border-destructive text-xs">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              
                              {item.notes && (
                                <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                                  <strong>Notes:</strong> {item.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Additional Notes */}
                <div>
                  <h3 className="text-lg font-pt-sans font-semibold text-foreground mb-3">
                    Additional Notes
                  </h3>
                  <Textarea
                    value={firNotes}
                    onChange={(e) => setFirNotes(e.target.value)}
                    placeholder="Add any additional information, special circumstances, or officer observations..."
                    className="min-h-[100px] focus-ring"
                    aria-label="Additional FIR notes"
                  />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};