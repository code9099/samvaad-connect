/**
 * Legal Assistant Modal Component
 * Search BNS (Bharatiya Nyaya Sanhita) sections with offline fallback
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Scale, BookOpen, FileText, ExternalLink } from 'lucide-react';

// Mock BNS data for offline fallback
const BNS_SECTIONS = [
  {
    section: 103,
    title: 'Murder',
    chapter: 'Chapter VI - Of Offences Affecting the Human Body',
    description: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
    keywords: ['murder', 'homicide', 'killing', 'death', 'life'],
    punishment: 'Death or Life imprisonment with fine'
  },
  {
    section: 304,
    title: 'Theft',
    chapter: 'Chapter XVII - Of Offences Against Property',
    description: 'Whoever intending to take dishonestly any movable property out of the possession of any person without that person\'s consent, moves that property in order to such taking, is said to commit theft.',
    keywords: ['theft', 'stealing', 'property', 'dishonestly', 'movable'],
    punishment: 'Imprisonment up to 3 years or fine or both'
  },
  {
    section: 351,
    title: 'Criminal intimidation',
    chapter: 'Chapter XVII - Of Offences Against Property',
    description: 'Whoever threatens another with any injury to his person, reputation or property, or to the person or reputation of any one in whom that person is interested, with intent to cause alarm to that person, commits criminal intimidation.',
    keywords: ['intimidation', 'threats', 'injury', 'reputation', 'alarm'],
    punishment: 'Imprisonment up to 2 years or fine or both'
  },
  {
    section: 420,
    title: 'Cheating and dishonestly inducing delivery of property',
    chapter: 'Chapter XVIII - Of Offences Relating to Documents and Property Marks',
    description: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, commits an offence punishable with imprisonment.',
    keywords: ['cheating', 'fraud', 'deception', 'property', 'dishonestly'],
    punishment: 'Imprisonment up to 7 years with fine'
  },
  {
    section: 279,
    title: 'Rash driving or riding on a public way',
    chapter: 'Chapter XIV - Of Offences Affecting the Public Health, Safety, Convenience, Decency and Morals',
    description: 'Whoever drives any vehicle, or rides, on any public way in a manner so rash or negligent as to endanger human life, or to be likely to cause hurt or injury to any other person, commits the offence of rash driving.',
    keywords: ['rash driving', 'negligent', 'vehicle', 'public way', 'endanger'],
    punishment: 'Imprisonment up to 6 months or fine up to ₹1000 or both'
  }
];

interface LegalAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateFIR: (section: any) => void;
}

export const LegalAssistant: React.FC<LegalAssistantProps> = ({ 
  isOpen, 
  onClose, 
  onGenerateFIR 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(BNS_SECTIONS);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any>(null);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(BNS_SECTIONS);
      return;
    }

    const filtered = BNS_SECTIONS.filter(section => 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      section.section.toString().includes(searchQuery)
    );

    setSearchResults(filtered);
  }, [searchQuery]);

  // Simulate BHASHINI search (would make actual API call in production)
  const handleBhashiniSearch = async () => {
    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo, just use offline results
    setIsSearching(false);
  };

  const handleSectionSelect = (section: any) => {
    setSelectedSection(section);
  };

  const SectionCard: React.FC<{ section: any }> = ({ section }) => (
    <Card 
      className="p-4 cursor-pointer tricolor-hover transition-all duration-200 hover:shadow-md"
      onClick={() => handleSectionSelect(section)}
      role="button"
      tabIndex={0}
      aria-label={`BNS Section ${section.section}: ${section.title}`}
    >
      <div className="flex items-start justify-between mb-2">
        <Badge variant="outline" className="text-navy border-navy">
          Section {section.section}
        </Badge>
        <BookOpen className="w-4 h-4 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-pt-sans font-semibold text-foreground mb-2">
        {section.title}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {section.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {section.chapter}
        </span>
        <Badge variant="secondary" className="text-xs">
          {section.punishment}
        </Badge>
      </div>
    </Card>
  );

  const SectionDetail: React.FC<{ section: any }> = ({ section }) => (
    <div className="modal-enter">
      <Card className="p-6 bg-gradient-to-br from-saffron/5 to-green/5 border-saffron/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Badge className="bg-navy text-white mb-2">
              BNS Section {section.section}
            </Badge>
            <h2 className="text-2xl font-pt-sans font-bold text-foreground">
              {section.title}
            </h2>
          </div>
          <Scale className="w-8 h-8 text-saffron" />
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Chapter
            </h3>
            <p className="text-base text-foreground">
              {section.chapter}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Description
            </h3>
            <p className="text-base text-foreground leading-relaxed">
              {section.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Punishment
            </h3>
            <Badge variant="outline" className="text-destructive border-destructive">
              {section.punishment}
            </Badge>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {section.keywords.map((keyword: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex space-x-3">
          <Button
            onClick={() => onGenerateFIR(section)}
            className="btn-ripple focus-ring bg-green hover:bg-green-dark text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate FIR Checklist
          </Button>
          
          <Button
            variant="outline"
            className="btn-ripple focus-ring"
            onClick={() => window.open('https://www.indiacode.nic.in', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Read More
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pt-sans text-foreground flex items-center">
            <Scale className="w-6 h-6 mr-2 text-saffron" />
            Legal Assistant
            <Badge variant="outline" className="ml-3 text-xs">
              BNS 2023
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Search and Results Panel */}
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search BNS sections, keywords, or offences..."
                  className="pl-10 focus-ring"
                  aria-label="Search legal sections"
                />
              </div>
              
              <Button
                onClick={handleBhashiniSearch}
                disabled={isSearching}
                className="btn-ripple focus-ring"
                aria-label="Search with BHASHINI"
              >
                {isSearching ? 'Searching...' : 'BHASHINI'}
              </Button>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {searchResults.length > 0 ? (
                  searchResults.map((section) => (
                    <SectionCard key={section.section} section={section} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No sections found for "{searchQuery}"</p>
                    <p className="text-sm mt-2">Try different keywords or browse all sections</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Detail Panel */}
          <div>
            {selectedSection ? (
              <SectionDetail section={selectedSection} />
            ) : (
              <Card className="p-8 h-full flex items-center justify-center text-center">
                <div className="space-y-4">
                  <Scale className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-pt-sans font-semibold text-foreground">
                    Select a Section
                  </h3>
                  <p className="text-muted-foreground max-w-sm">
                    Choose a BNS section from the list to view detailed information, 
                    punishment guidelines, and generate FIR checklists.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};