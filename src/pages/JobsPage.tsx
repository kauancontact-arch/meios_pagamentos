import { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { mockJobs } from '@/mocks/jobs';
import { JobCard } from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Search, Filter, MapPin, Building, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

type SortBy = 'recent' | 'company' | 'salary';

export function JobsPage() {
  const { currentUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [showShareForm, setShowShareForm] = useState(false);

  const types = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'full-time', label: 'Tempo Integral' },
    { value: 'part-time', label: 'Meio Período' },
    { value: 'contract', label: 'Contrato' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Estágio' }
  ];

  const experiences = [
    { value: 'all', label: 'Todas as senioridades' },
    { value: 'entry', label: 'Júnior' },
    { value: 'mid', label: 'Pleno' },
    { value: 'senior', label: 'Sênior' },
    { value: 'lead', label: 'Líder' },
    { value: 'executive', label: 'Executivo' }
  ];

  const locations = [
    { value: 'all', label: 'Todas as localizações' },
    { value: 'remote', label: 'Remoto' },
    { value: 'São Paulo, SP', label: 'São Paulo, SP' },
    { value: 'Rio de Janeiro, RJ', label: 'Rio de Janeiro, RJ' },
    { value: 'Belo Horizonte, MG', label: 'Belo Horizonte, MG' },
    { value: 'Porto Alegre, RS', label: 'Porto Alegre, RS' },
    { value: 'Brasília, DF', label: 'Brasília, DF' }
  ];

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = mockJobs.filter(job => {
      // Search filter
      if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !job.company.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !job.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && job.type !== selectedType) {
        return false;
      }

      // Experience filter
      if (selectedExperience !== 'all' && job.experience !== selectedExperience) {
        return false;
      }

      // Location filter
      if (selectedLocation === 'remote' && !job.isRemote) {
        return false;
      }
      if (selectedLocation !== 'all' && selectedLocation !== 'remote' && job.location !== selectedLocation) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
        case 'company':
          return a.company.localeCompare(b.company);
        case 'salary':
          const aSalary = a.salary?.max || 0;
          const bSalary = b.salary?.max || 0;
          return bSalary - aSalary;
        default:
          return 0;
      }
    });

    return filtered;
  }, [mockJobs, searchTerm, selectedType, selectedExperience, selectedLocation, sortBy]);

  const handleApplyToJob = (job: any) => {
    // Mock application
    toast.success(`Candidatura enviada para ${job.title} na ${job.company}!`);
  };

  const handleShareJob = () => {
    // Mock job sharing
    toast.success('Vaga compartilhada com sucesso na comunidade!');
    setShowShareForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Empregos</h1>
          <p className="text-gray-500">Oportunidades de carreira no mercado de pagamentos.</p>
        </div>
        <Button onClick={() => setShowShareForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Compartilhar Vaga
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockJobs.length}</p>
                <p className="text-sm text-gray-500">Vagas disponíveis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{new Set(mockJobs.map(j => j.company)).size}</p>
                <p className="text-sm text-gray-500">Empresas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{mockJobs.filter(j => j.isRemote).length}</p>
                <p className="text-sm text-gray-500">Vagas remotas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Plus className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{mockJobs.filter(j => j.type === 'internship').length}</p>
                <p className="text-sm text-gray-500">Estágios</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Share Job Form */}
      {showShareForm && (
        <Card>
          <CardHeader>
            <CardTitle>Compartilhar Vaga</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">URL da vaga</label>
              <Input placeholder="https://empresa.com/vaga/desenvolvedor" />
            </div>
            <div>
              <label className="text-sm font-medium">Título da vaga</label>
              <Input placeholder="Desenvolvedor Full Stack Sênior" />
            </div>
            <div>
              <label className="text-sm font-medium">Empresa</label>
              <Input placeholder="Nome da Empresa" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleShareJob}>Compartilhar</Button>
              <Button variant="outline" onClick={() => setShowShareForm(false)}>
                Cancelar
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Compartilhe vagas de emprego de sites externos. A comunidade poderá se candidatar diretamente no site da empresa.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar vagas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Senioridade" />
                </SelectTrigger>
                <SelectContent>
                  {experiences.map(exp => (
                    <SelectItem key={exp.value} value={exp.value}>
                      {exp.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Localização" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc.value} value={loc.value}>
                      {loc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="company">Por empresa</SelectItem>
                  <SelectItem value="salary">Por salário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredAndSortedJobs.length} vaga{filteredAndSortedJobs.length !== 1 ? 's' : ''} encontrada{filteredAndSortedJobs.length !== 1 ? 's' : ''}
        </p>
        {(searchTerm || selectedType !== 'all' || selectedExperience !== 'all' || selectedLocation !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedExperience('all');
              setSelectedLocation('all');
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Jobs Grid */}
      {filteredAndSortedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onClick={() => window.open(job.applicationUrl, '_blank')}
              onApply={() => handleApplyToJob(job)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma vaga encontrada</h3>
          <p className="text-gray-500 mb-4">Tente ajustar os filtros ou termos de busca.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedExperience('all');
              setSelectedLocation('all');
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}