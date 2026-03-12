import React, { useState, useMemo } from 'react';
import { 
  Search, AlertCircle, CheckCircle, ChevronRight, ArrowLeft, 
  Info, AlertTriangle, HeartPulse, CalendarCheck, IdCard, 
  CreditCard, FileText, Home, Briefcase 
} from 'lucide-react';

import { COUNTRIES, CIRCUMSTANCES, STEPS, DOCUMENT_OPTIONS, DOCUMENTATION_SCENARIOS } from './registrationConfig.js';
import { calculateResult as calculateRegistrationResult, getDocumentationScenario, isDocumentationSufficient } from './registrationRules.js';
import { DipsGuidePasFin, DipsGuidePasReg } from './DipsGuide.jsx';

// --- DATASTRUKTUR ---
const DOCUMENT_ICONS = { IdCard, CreditCard, FileText, Home, Briefcase, AlertCircle };

// --- HOVEDKOMPONENT ---
export default function RegistrationWizard() {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [isPrcModalOpen, setIsPrcModalOpen] = useState(false);
  
  const [highlightedCountryIndex, setHighlightedCountryIndex] = useState(0);
  
  const [data, setData] = useState({
    country: null,
    countrySearchTimestamp: null,
    circumstance: null,
    circumstances: [],
    isUndocumented: false,
    need: null,
    hasDoc: null,
  });

  const getSelectedCircumstances = (value) => {
    if (Array.isArray(value?.circumstances)) {
      return value.circumstances;
    }

    if (value?.circumstance) {
      return [value.circumstance];
    }

    return [];
  };

  const hasCircumstance = (value, circumstanceId) => getSelectedCircumstances(value).includes(circumstanceId);

  const shouldSkipDocumentation = (value) => {
    const selectedCircumstances = getSelectedCircumstances(value);
    const hasChildCombination = selectedCircumstances.includes('child') && selectedCircumstances.length > 1;

    if (selectedCircumstances.includes('psychiatry')) {
      return false;
    }

    if (selectedCircumstances.includes('family_reunification')) {
      return false;
    }

    if (selectedCircumstances.includes('prisoner')) {
      return true;
    }

    if (hasChildCombination) {
      return true;
    }

    if (value?.isUndocumented) {
      return true;
    }

    if (selectedCircumstances.includes('child') && value?.country?.zone !== 'EU_EOS' && !selectedCircumstances.includes('worker') && !selectedCircumstances.includes('family_reunification')) {
      return true;
    }

    return false;
  };

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return [];
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const handleSearchKeyDown = (e) => {
    if (!filteredCountries.length) {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedCountryIndex((prev) => (prev + 1) % filteredCountries.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedCountryIndex((prev) => (prev - 1 + filteredCountries.length) % filteredCountries.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleCountrySelect(filteredCountries[highlightedCountryIndex]);
    }
  };

  const updateData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleCountrySelect = (country) => {
    setSelectedDocs([]);
    setData({
      country,
      countrySearchTimestamp: Date.now(),
      circumstance: null,
      circumstances: [],
      isUndocumented: false,
      need: null,
      hasDoc: null,
    });
    setSearchTerm(country.name);
    setHighlightedCountryIndex(0);
    setTimeout(() => setStep(2), 150);
  };

  const resetWizard = () => {
    setStep(1);
    setSearchTerm('');
    setSelectedDocs([]);
    setHighlightedCountryIndex(0);
    setData({ country: null, countrySearchTimestamp: null, circumstance: null, circumstances: [], isUndocumented: false, need: null, hasDoc: null });
  };

  const renderTextWithPrcLink = (text) => {
    if (!text || !text.includes('PRC')) {
      return text;
    }

    return text.split(/(PRC)/g).map((part, index) => {
      if (part !== 'PRC') {
        return <React.Fragment key={index}>{part}</React.Fragment>;
      }

      return (
        <button
          key={index}
          type="button"
          onClick={() => setIsPrcModalOpen(true)}
          className="font-semibold text-blue-700 underline hover:text-blue-800"
        >
          PRC
        </button>
      );
    });
  };

  const handleUnknownPatient = (isChild = false) => {
    setData({ country: null, countrySearchTimestamp: null, circumstance: isChild ? 'child' : null, circumstances: isChild ? ['child'] : [], isUndocumented: true, need: null, hasDoc: null });
    setStep(4);
  };

  const handleStepNavigation = (nextStep) => {
    if (nextStep === 1) {
      setData((prev) => ({ ...prev, isUndocumented: false }));
      setSearchTerm('');
      setHighlightedCountryIndex(0);
    }

    setStep(nextStep);
  };

  const FamilyReunificationNotice = () => (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="space-y-2 text-sm text-amber-950">
          <p className="font-bold">Viktig ved familiegjenforening / familieinnvandring</p>
          <p>
            Dersom pasienten oppholder seg i Norge mens søknad om familieinnvandring behandles, har pasienten som hovedregel
            ikke helserettigheter i Norge ennå.
          </p>
          <p>
            Det betyr at pasienten normalt bare har rett til øyeblikkelig hjelp, og skal ellers registreres som selvbetalende.
          </p>
          <p>
            Dette gjelder også dersom pasienten er gravid. Graviditet i seg selv gir ikke dekning fra Norge mens søknaden fortsatt er til behandling.
          </p>
        </div>
      </div>
    </div>
  );

  const result = step === 4 ? calculateRegistrationResult(data) : null;

  const renderStep1 = () => {
    const showUndocumentedChoices = data.isUndocumented && !data.country;

    return (
      <div className="space-y-6">
        {!showUndocumentedChoices && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base shadow-sm" placeholder="F.eks. Spania..." value={searchTerm} onChange={(e) => {
                setSearchTerm(e.target.value);
                setHighlightedCountryIndex(0);
              }} onKeyDown={handleSearchKeyDown} autoFocus />
              {searchTerm && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country, index) => (
                      <button key={country.code} onClick={() => handleCountrySelect(country)} className={`w-full text-left px-4 py-3 transition-colors border-b last:border-0 flex justify-between items-center group ${highlightedCountryIndex === index ? 'bg-blue-50' : 'hover:bg-blue-50 focus:bg-blue-50'}`}>
                        <span className="font-medium text-gray-800">{country.name}</span>
                        <ChevronRight className={`h-4 w-4 ${highlightedCountryIndex === index ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'}`} />
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">Fant ingen land i systemet. Prøv engelsk navn hvis norsk feiler.</div>
                  )}
                </div>
              )}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">Skriv inn landet hvor pasienten har statsborgerskap eller trygdetilhørighet.<br />Dette danner grunnlaget for finansiering og registrering.</p>
          </div>
        )}
        <div className="mt-8 pt-6 border-t border-gray-100">
          {!showUndocumentedChoices ? (
            <button onClick={() => setData((prev) => ({ ...prev, country: null, circumstance: null, circumstances: [], isUndocumented: true, need: null, hasDoc: null }))} className="w-full flex items-center justify-between p-4 border border-gray-200 bg-gray-50 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-colors group">
              <div className="flex items-center">
                <div className="bg-red-100 group-hover:bg-red-200 p-2 rounded-lg mr-4 transition-colors">
                  <span className="h-5 w-5 text-red-600 group-hover:text-red-700 transition-colors flex items-center justify-center font-bold text-base leading-none">?</span>
                </div>
                <div className="text-left">
                  <span className="font-bold text-gray-800 group-hover:text-orange-900 block transition-colors">Ikke identifiserbar / Papirløs</span>
                  <span className="text-sm text-gray-500 group-hover:text-orange-700 transition-colors">Gå til rutiner for pasient uten lovlig opphold eller ukjent ID</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                <p className="font-bold text-gray-800 text-center">Papirløs / uten lovlig opphold</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button onClick={() => handleUnknownPatient(true)} className="w-full p-4 border border-sky-200 bg-sky-50 rounded-xl hover:bg-sky-100 hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors text-left">
                    <span className="font-bold text-gray-800 block">Under 18 år</span>
                  </button>
                  <button onClick={() => handleUnknownPatient(false)} className="w-full p-4 border border-violet-300 bg-violet-100 rounded-xl hover:bg-violet-200 hover:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors text-left">
                    <span className="font-bold text-gray-800 block">Over 18 år</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    if (!data.country) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Mangler land</h2>
          <p className="text-gray-500 mb-6">Du må velge pasientens hjemland før du kan gå videre.</p>
          <button onClick={() => setStep(1)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">Gå til Steg 1</button>
        </div>
      );
    }

    const circumstanceOrder = [
      'pregnancy',
      'psychiatry',
      'family_reunification',
      'asylum',
      'worker',
      'child',
      'prisoner',
      'student_non_eu',
    ];

    const selectedCircumstances = getSelectedCircumstances(data);

    const availableCircumstances = CIRCUMSTANCES.filter((circ) => {
      if (circ.id === 'asylum') {
        return data.country && data.country.zone !== 'EU_EOS';
      }

      if (circ.id === 'family_reunification') {
        return data.country && data.country.zone !== 'EU_EOS';
      }

      return true;
    });

    const defaultCircumstance = availableCircumstances.find((circ) => circ.id === 'none');
    const prioritizedCircumstances = circumstanceOrder
      .map((id) => availableCircumstances.find((circ) => circ.id === id))
      .filter(Boolean);

    const handleNoSpecialCircumstances = () => {
      const nextData = {
        ...data,
        circumstance: 'none',
        circumstances: [],
        need: null,
        hasDoc: null,
      };

      setData(nextData);

      if (shouldSkipDocumentation(nextData)) {
        setStep(4);
      } else {
        setStep(3);
      }
    };

    const toggleCircumstance = (circId) => {
      if (circId === 'none') {
        handleNoSpecialCircumstances();
        return;
      }

      setData((prev) => {
        const previousCircumstances = getSelectedCircumstances(prev);
        const nextCircumstances = previousCircumstances.includes(circId)
          ? previousCircumstances.filter((id) => id !== circId)
          : [...previousCircumstances, circId];

        return {
          ...prev,
          circumstance: nextCircumstances[0] || null,
          circumstances: nextCircumstances,
          need: null,
          hasDoc: null,
        };
      });
    };

    const handleCircumstancesContinue = () => {
      const nextData = {
        ...data,
        circumstance: selectedCircumstances[0] || null,
        circumstances: selectedCircumstances,
        need: null,
        hasDoc: null,
      };

      setData(nextData);

      if (shouldSkipDocumentation(nextData)) {
        setStep(4);
      } else {
        setStep(3);
      }
    };

    return (
      <div className="space-y-6">
        <button onClick={() => setStep(1)} className="w-full bg-gray-50 border p-4 rounded-lg mb-6 flex justify-between items-center text-left hover:bg-blue-50 hover:border-blue-200 transition-colors">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Valgt land</p>
            <p className="text-lg font-bold text-gray-800">{data.country.name}</p>
          </div>
          <span className="text-sm text-blue-600">Endre</span>
        </button>
        {defaultCircumstance && (
          <div className="mt-4">
            <button
              key={defaultCircumstance.id}
              onClick={handleNoSpecialCircumstances}
              className="w-full text-left px-5 py-4 border border-gray-200 rounded-2xl bg-white hover:bg-blue-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-between group"
            >
              <span className="font-medium text-gray-700 group-hover:text-blue-700 leading-snug pr-4">{defaultCircumstance.label}</span>
            </button>
          </div>
        )}
        <div className="pt-5 border-t border-gray-200 space-y-3">
          <p className="text-gray-600 text-center">Gjelder noen av følgende situasjoner for pasienten?</p>
          {prioritizedCircumstances.map((circ) => (
            <button
              key={circ.id}
              onClick={() => toggleCircumstance(circ.id)}
              className={`w-full text-left px-5 py-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-between group ${selectedCircumstances.includes(circ.id) ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gradient-to-r from-white to-slate-50 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-400'}`}
            >
              <span className="font-medium text-gray-700 group-hover:text-blue-700 leading-snug pr-4">{circ.label}</span>
              {selectedCircumstances.includes(circ.id) ? <CheckCircle className="h-5 w-5 text-blue-500" /> : null}
            </button>
          ))}
        </div>
        <button onClick={handleCircumstancesContinue} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          Gå videre
        </button>
      </div>
    );
  };

  const renderStep3 = () => {
    if (!data.country || (getSelectedCircumstances(data).length === 0 && !data.circumstance)) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Informasjon mangler</h2>
          <p className="text-gray-500 mb-6">Fyll ut de foregående stegene før du kan oppgi dokumentasjon.</p>
          <button onClick={() => setStep(2)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">Gå til Steg 2</button>
        </div>
      );
    }

    const documentationScenarioKey = getDocumentationScenario(data);
    const documentationScenario = documentationScenarioKey ? DOCUMENTATION_SCENARIOS[documentationScenarioKey] : null;

    const showNeedSelector = hasCircumstance(data, 'psychiatry') || ((data.country.zone === 'EU_EOS' || data.country.zone === 'Konvensjon') && !hasCircumstance(data, 'worker') && !hasCircumstance(data, 'child'));

    if (showNeedSelector && !data.need) {
      return (
        <div className="space-y-6">
          <button onClick={() => setStep(2)} className="flex items-center text-sm text-gray-500 hover:text-gray-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Tilbake
          </button>
          {hasCircumstance(data, 'family_reunification') && <FamilyReunificationNotice />}
          <h2 className="text-xl font-bold text-gray-800">Gjelder det akutt, planlagt{hasCircumstance(data, 'psychiatry') ? ' eller tvang' : ''}?</h2>
          <div className={`grid grid-cols-1 ${hasCircumstance(data, 'psychiatry') ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
            <button onClick={() => updateData('need', 'acute')} className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 text-center transition-all group">
              <HeartPulse className="h-10 w-10 mx-auto text-red-500 mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-gray-800 block text-lg">Akutt (Nødvendig)</span>
              <span className="text-xs text-gray-500 mt-1 block">Helsehjelp som ikke kan vente til pasienten reiser hjem</span>
            </button>

            <button onClick={() => updateData('need', 'planned')} className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 text-center transition-all group">
              <CalendarCheck className="h-10 w-10 mx-auto text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-gray-800 block text-lg">Planlagt behandling</span>
              <span className="text-xs text-gray-500 mt-1 block">Pasienten har reist hit formelt for behandling</span>
            </button>
            {hasCircumstance(data, 'psychiatry') && (
              <button onClick={() => updateData('need', 'coercion')} className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 text-center transition-all group">
                <AlertTriangle className="h-10 w-10 mx-auto text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-gray-800 block text-lg">Tvang</span>
                <span className="text-xs text-gray-500 mt-1 block">Tvangsinnleggelse / tvungent psykisk helsevern</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    const toggleDoc = (id, groupDocuments = [], isSingleSelect = false) => setSelectedDocs((prev) => {
      if (isSingleSelect) {
        const docsOutsideGroup = prev.filter((doc) => !groupDocuments.includes(doc));
        return [...docsOutsideGroup, id];
      }

      return prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id];
    });

    const CheckboxItem = ({ id, label, icon: Icon, inputType = 'checkbox', groupDocuments = [], isSingleSelect = false }) => (
      <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${selectedDocs.includes(id) ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
        <div className="flex-shrink-0 mr-4">
          <input type={inputType} name={isSingleSelect ? `doc-group-${groupDocuments.join('-')}` : id} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" checked={selectedDocs.includes(id)} onChange={() => toggleDoc(id, groupDocuments, isSingleSelect)} />
        </div>
        <div className="flex items-center flex-1">
          <Icon className={`h-6 w-6 mr-3 ${selectedDocs.includes(id) ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className={`text-sm font-medium ${selectedDocs.includes(id) ? 'text-blue-900' : 'text-gray-700'}`}>{label}</span>
        </div>
      </label>
    );

    return (
      <div className="space-y-6">
        <button onClick={() => { setStep(2); setSelectedDocs([]); }} className="flex items-center text-sm text-gray-500 hover:text-gray-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Tilbake
        </button>
        {hasCircumstance(data, 'family_reunification') && <FamilyReunificationNotice />}
        {showNeedSelector && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Gjelder det akutt, planlagt{hasCircumstance(data, 'psychiatry') ? ' eller tvang' : ''}?</h2>
            <div className={`grid grid-cols-1 ${hasCircumstance(data, 'psychiatry') ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
              <button
                onClick={() => updateData('need', 'acute')}
                className={`p-6 border-2 rounded-xl text-center transition-all group ${data.need === 'acute' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'}`}
              >
                <HeartPulse className="h-10 w-10 mx-auto text-red-500 mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-gray-800 block text-lg">Akutt (Nødvendig)</span>
                <span className="text-xs text-gray-500 mt-1 block">Helsehjelp som ikke kan vente til pasienten reiser hjem</span>
              </button>
              <button
                onClick={() => updateData('need', 'planned')}
                className={`p-6 border-2 rounded-xl text-center transition-all group ${data.need === 'planned' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'}`}
              >
                <CalendarCheck className="h-10 w-10 mx-auto text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-gray-800 block text-lg">Planlagt behandling</span>
                <span className="text-xs text-gray-500 mt-1 block">Pasienten har reist hit formelt for behandling</span>
              </button>
              {hasCircumstance(data, 'psychiatry') && (
                <button
                  onClick={() => updateData('need', 'coercion')}
                  className={`p-6 border-2 rounded-xl text-center transition-all group ${data.need === 'coercion' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'}`}
                >
                  <AlertTriangle className="h-10 w-10 mx-auto text-orange-500 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-gray-800 block text-lg">Tvang</span>
                  <span className="text-xs text-gray-500 mt-1 block">Tvangsinnleggelse / tvungent psykisk helsevern</span>
                </button>
              )}
            </div>
          </div>
        )}
        <h2 className="text-xl font-bold text-gray-800">Påkrevd dokumentasjon</h2>
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mt-4">
          <p className="text-gray-600 mb-6 text-sm">
            {hasCircumstance(data, 'worker') 
              ? 'For å registrere pasienten med norske rettigheter som arbeidstaker må følgende sjekkes:'
              : `For å registrere ${data.country.name} som trygdenasjon med riktig finansiering må følgende sjekkes:`}
          </p>
          <div className="space-y-3 mb-6">
            {documentationScenario?.groups.map((group) => (
              <div key={group.title}>
                <p className="font-semibold text-gray-800 mb-2">{group.title}</p>
                <div className="space-y-3">
                  {group.documents.map((documentId) => {
                    const document = DOCUMENT_OPTIONS[documentId];
                    const Icon = DOCUMENT_ICONS[document.icon];
                    const oneOfRequirements = documentationScenario?.requirements?.oneOf || [];
                    const isSingleSelectGroup = group.documents.every((groupDocumentId) => oneOfRequirements.includes(groupDocumentId));

                    return (
                      <CheckboxItem
                        key={documentId}
                        id={documentId}
                        label={document.label}
                        icon={Icon}
                        inputType={isSingleSelectGroup ? 'radio' : 'checkbox'}
                        groupDocuments={group.documents}
                        isSingleSelect={isSingleSelectGroup}
                      />
                    );
                  })}
                </div>
              </div>
            ))}

            {documentationScenario?.infoType === 'andre_info' && (
              <div className="flex items-start bg-orange-50 p-4 rounded-xl mt-4">
                <Info className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Pasienter fra "{data.country.name}" har ingen offentlig dekning i Norge og går som selvbetalende. Legitimasjon og adresse sikrer korrekt ID og faktureringsgrunnlag i systemet.</span>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
            <button 
              disabled={!isDocumentationSufficient(data, selectedDocs)}
              onClick={() => { updateData('hasDoc', true); setStep(4); }}
              className={`flex-1 font-bold py-4 px-4 rounded-xl transition-all shadow-sm flex justify-center items-center ${
                isDocumentationSufficient(data, selectedDocs) ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}
            >
              <CheckCircle className="h-5 w-5 mr-2" /> Dokumentasjon fremvist
            </button>
            <button 
              onClick={() => { updateData('hasDoc', false); setStep(4); }}
              className="flex-1 bg-white text-red-600 border-2 border-red-200 font-bold py-4 px-4 rounded-xl hover:bg-red-50 transition-colors shadow-sm flex justify-center items-center"
            >
              Mangler dokumentasjon
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    const result = calculateRegistrationResult(data);
    const shouldShowDipsGuidePasReg = Boolean(data?.country);
    const shouldShowDipsGuidePasFin = Boolean(data?.country) && (data.country.zone === 'EU_EOS' || data.country.zone === 'Konvensjon');

    if (!result) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />

          <h2 className="text-xl font-bold text-gray-700 mb-2">Ingen fasit tilgjengelig enda</h2>
          <p className="text-gray-500 mb-6">Du må fullføre de tidligere stegene for at systemet skal kunne beregne DIPS-registreringen.</p>
        </div>
      );
    }

    const bgColors = { success: 'bg-green-50 border-green-200', warning: 'bg-orange-50 border-orange-200', error: 'bg-red-50 border-red-200' };
    const iconColors = { success: <CheckCircle className="h-8 w-8 text-green-600" />, warning: <AlertTriangle className="h-8 w-8 text-orange-600" />, error: <AlertCircle className="h-8 w-8 text-red-600" /> };

    const getHelfoDocumentationTitle = () => {
      if (!Array.isArray(selectedDocs) || selectedDocs.length === 0) {
        return null;
      }

      const preferredOrder = ['ehic', 'prc', 's1', 's2', 's3'];
      const firstMatch = preferredOrder.find((docId) => selectedDocs.includes(docId));

      if (!firstMatch) {
        return null;
      }

      const titleByDoc = {
        ehic: 'EHIC',
        prc: 'PRC',
        s1: 'S1',
        s2: 'S2',
        s3: 'S3',
      };

      return titleByDoc[firstMatch] || null;
    };

    const resultTitle = (() => {
      if (result.finansiering?.includes('Selvbetalende')) {
        return 'Selvbetalende';
      }

      if (result.finansiering?.includes('Helfo')) {
        const docTitle = getHelfoDocumentationTitle();
        if (docTitle) {
          return `${docTitle} / Helfo`;
        }
      }

      return result.finansiering;
    })();
    const rawHandlingItems = (result.handling || '')
      .split(result.handling?.includes('\n') ? /\n+/ : /(?<=\.)\s+/)
      .map((item) => item.trim())
      .filter(Boolean);

    const handlingItems = rawHandlingItems.reduce((items, item) => {
      if (/^Dette kan være\b/.test(item) && items.length > 0) {
        const previousItem = items[items.length - 1];
        items[items.length - 1] = { ...previousItem, detail: item };
        return items;
      }

      items.push({ text: item, detail: '' });
      return items;
    }, []);

    const openFinancingGuide = () => {
      window.requestAnimationFrame(() => {
        const container = document.getElementById('dips-pasientfinansiering-guide');
        if (!container) {
          return;
        }

        container.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const isMobile = window.innerWidth < 640;
        const toggle = container.querySelector(`[data-financing-guide-toggle="${isMobile ? 'mobile' : 'desktop'}"]`);
        if (toggle && typeof toggle.click === 'function') {
          toggle.click();
        }
      });
    };

    return (
      <div className="space-y-6">
        {isPrcModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="Lukk"
              onClick={() => setIsPrcModalOpen(false)}
              className="absolute inset-0 bg-black/40"
            />
            <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-200 p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-xl font-bold text-gray-900">Hva er PRC (Hasteblankett)?</h3>
                <button
                  type="button"
                  onClick={() => setIsPrcModalOpen(false)}
                  className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Lukk
                </button>
              </div>
              <div className="space-y-4 text-gray-800">
                <p>En PRC er en midlertidig erstatning for Europeisk helsetrygdkort (EHIC).</p>
                <div>
                  <p className="font-semibold">Når brukes det?</p>
                  <p>
                    Hvis en pasient fra et EØS-land har glemt, mistet, eller ikke rukket å få det fysiske EHIC-kortet sitt før de reiste til Norge.
                    De kan da kontakte trygdemyndighetene i hjemlandet sitt, som sender over en PRC per faks eller epost.
                    Dette videresendes da til Helseforetaket av pasienten selv.
                    Merk at enkelte nasjoner har ulike navn og søkeprosesser på PRC.
                    Be pasient søke opp EHIC PRC + landet sitt.
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Hvilke rettigheter gir det?</p>
                  <p>Nøyaktig de samme som et vanlig EHIC-kort. Altså rett til nødvendig helsehjelp under et midlertidig opphold.</p>
                </div>
                <div>
                  <p className="font-semibold">Hva gjør du i DIPS?</p>
                  <p>Naviger til frikodefeltet, velg konvensjonsavtale og deretter hasteblankett. De betaler da kun vanlig egenandel.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={`border-2 p-6 rounded-2xl ${bgColors[result.type]}`}>
          <div className="flex items-start space-x-4 mb-6">
            <div className="mt-1">{iconColors[result.type]}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{resultTitle}</h3>
              <p className="text-gray-700 mt-1">{result.beskrivelse}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Registreres i DIPS som</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 min-w-0 overflow-hidden">
                  <span className="block text-xs text-gray-500 mb-1 break-words">Trygdenasjon</span>
                  <span className="block font-bold text-gray-800 break-words">{result.trygdenasjon}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 min-w-0 overflow-hidden">
                  <span className="block text-xs text-gray-500 mb-1 break-words">Finansieringskategori</span>
                  <span className="block font-bold text-gray-800 break-words">{result.finansiering.split('/')[0].trim()}</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Praktisk informasjon</p>
              <div className="text-gray-800 bg-yellow-50 p-3 rounded-lg border border-yellow-100 break-words">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-600" />
                    <span>
                      <span className="block">
                        Registrer EHIC i DIPS i henhold til lokale rutiner. For veiledning og eksempler på EHIC kort naviger til{' '}
                        <button type="button" onClick={openFinancingGuide} className="font-semibold text-blue-700 underline hover:text-blue-800">
                          Veiledning for felter i DIPS Pasientfinansiering
                        </button>
                        .
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-600" />
                    <span>
                      <span className="block">Ta kopi av EHIC (Bakside og fremside)</span>
                    </span>
                  </li>
                  {handlingItems.map((item) => (
                    <li key={item.text} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-600" />
                      <span>
                        <span className="block">{renderTextWithPrcLink(item.text)}</span>
                        {item.detail && <span className="block mt-1">{item.detail}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {shouldShowDipsGuidePasReg && <DipsGuidePasReg trygdenasjon={result.trygdenasjon} />}
        {shouldShowDipsGuidePasFin && (
          <DipsGuidePasFin
            countryName={data?.country?.name}
            docType={getHelfoDocumentationTitle() || ''}
            searchTimestamp={data?.countrySearchTimestamp}
            onBackToDocumentation={() => setStep(3)}
          />
        )}

        <button onClick={resetWizard} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-md mt-8">
          Start ny registrering
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center py-3 sm:py-6 md:py-10 px-3 sm:px-4 font-sans text-gray-900">
      <div className="w-full max-w-2xl">
        <div className="mb-2 sm:mb-4 md:mb-6 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-900">Veileder for helserettigheter</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-4 sm:p-6 md:p-8 min-h-[400px] overflow-hidden">
          <div className="relative mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-start">
              {STEPS.map((s, index) => (
                <React.Fragment key={s.id}>
                  <button onClick={() => handleStepNavigation(s.id)} title={`Gå til fase ${s.id}: ${s.label}`} className="flex flex-col items-center focus:outline-none group cursor-pointer w-16 sm:w-20 md:w-24 flex-shrink-0 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${step === s.id ? 'ring-4 ring-blue-200 bg-blue-600 text-white shadow-lg' : ''} ${step > s.id ? 'bg-blue-600 text-white shadow-md' : step < s.id ? 'bg-white text-gray-400 border-2 border-gray-200 group-hover:border-blue-400' : ''}`}>
                      {step > s.id && s.id !== 4 ? <CheckCircle className="h-4 w-4" /> : s.id}
                    </div>
                    <div className={`mt-2 text-[10px] sm:text-xs md:text-sm font-semibold text-center leading-tight transition-colors duration-300 break-words ${step === s.id ? 'text-blue-700' : step > s.id ? 'text-gray-700' : 'text-gray-400 group-hover:text-blue-500'}`}>
                      {s.label}
                    </div>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div className="flex-1 mt-4 px-0.5 sm:px-1 md:px-2 min-w-0">
                      <div className={`h-1.5 rounded-full transition-colors duration-500 ${step > s.id ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-slate-200'}`}></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
}