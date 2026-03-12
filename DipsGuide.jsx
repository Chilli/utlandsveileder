import React, { useState } from 'react';
import { IdCard, Wallet, ChevronDown, ChevronUp } from 'lucide-react';

import { calculateEhicValidFrom } from './registrationRules.js';

const formatDate = (value) => {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

export function DipsGuidePasReg({ trygdenasjon }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-bold text-gray-800 flex items-center">
          <IdCard className="h-5 w-5 mr-3 text-blue-600" />
          Veiledning for felter i DIPS Personopplysninger
        </span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>

      {isOpen && (
        <div className="p-6 bg-white space-y-8 border-t border-gray-200 text-sm">
        <section>
          <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Adresse</h3>
          <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6 shadow-sm border border-blue-100">
            <p>Fyll inn følgende felt med korrekt utenlandsk adresse. Dette utføres etter det er valgt "9999" i feltet <em className="font-semibold">Postnr / Sted</em> lenger ned.</p>
          </div>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-2xl relative mt-6">
            <span className="absolute -top-3 left-4 bg-white px-2 font-bold text-gray-600">Adresse i utlandet</span>
            <div className="space-y-4 mt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Adresse</label>
                <input readOnly className="w-full p-2.5 border-2 border-yellow-400 bg-yellow-50 rounded-lg outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Adresselinje 2</label>
                <input readOnly className="w-full p-2.5 border border-gray-300 bg-gray-50 rounded-lg outline-none cursor-not-allowed" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Postnummer</label>
                  <input readOnly className="w-full p-2.5 border-2 border-yellow-400 bg-yellow-50 rounded-lg outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Poststed</label>
                  <input readOnly className="w-full p-2.5 border-2 border-yellow-400 bg-yellow-50 rounded-lg outline-none cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Land</label>
                <input readOnly value={trygdenasjon || ''} className="w-full p-2.5 border-2 border-yellow-400 bg-yellow-50 rounded-lg outline-none text-gray-800 font-medium cursor-not-allowed" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Postnr / Sted</label>
              <input readOnly value="9999 Utenlands postadr." className="w-full p-2.5 border-2 border-yellow-400 bg-yellow-50 rounded-lg outline-none text-gray-800 font-medium cursor-not-allowed" />
            </div>
            <div className="bg-blue-50 text-blue-800 p-3 rounded-xl text-xs border border-blue-100">
              Aktiver adressefeltet for "Adresse i utlandet" ved å sette inn "9999" i feltet for Postnummer
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Kommunenr / Kommune</label>
            <input readOnly value="9999 Utlending" className="w-full p-2.5 border-2 border-yellow-400 bg-yellow-50 rounded-lg outline-none text-gray-800 font-medium w-1/2 cursor-not-allowed" />
          </div>
        </section>

        <section>
          <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Tilhørighet</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Trygdenasjon</label>
              <select disabled className="w-full p-2.5 border-2 border-yellow-400 bg-yellow-50 rounded-lg outline-none text-gray-800 font-medium appearance-none cursor-not-allowed">
                <option>{trygdenasjon || '-- Velg --'}</option>
              </select>
            </div>
            <div className="bg-blue-50 text-blue-800 p-3 rounded-xl text-xs border border-blue-100">
              Fyll inn pasientens bostedsland i feltet for Trygdenasjon
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Sykehustilhørighet</label>
            <select disabled className="w-full md:w-1/2 p-2.5 border border-gray-300 bg-gray-50 rounded-lg outline-none text-gray-500 appearance-none cursor-not-allowed">
              <option>-- Velg --</option>
            </select>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Midlertidig adresse</h3>
          <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6 shadow-sm border border-blue-100">
            <p>Dersom pasienten har en midlertidig adresse i Norge skal denne registreres i disse feltene. Feltet kan åpnes i DIPS ved å trykke på "+ Legg til".</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Adresse</label>
              <input readOnly className="w-full p-2.5 border border-gray-300 bg-gray-50 rounded-lg outline-none cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Postnr / Sted</label>
              <input readOnly className="w-full md:w-1/2 p-2.5 border border-gray-300 bg-gray-50 rounded-lg outline-none cursor-not-allowed" />
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm font-bold text-blue-900 mb-4 uppercase tracking-wider">Gyldig i tidsrom</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Fra og med</label>
                  <input readOnly className="w-full p-2.5 border-2 border-yellow-400 bg-yellow-50 rounded-lg outline-none cursor-not-allowed" type="text" placeholder="DD.MM.ÅÅÅÅ" />
                </div>
                <div className="bg-blue-50 text-blue-800 p-3 rounded-xl text-xs border border-blue-100">
                  Registrer fra dato pasient ble registrert i folkeregisteret, eller dagens dato dersom pasient ikke er i folkeregisteret
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Til og med</label>
                <input readOnly className="w-full md:w-1/2 p-2.5 border border-gray-300 bg-gray-50 rounded-lg outline-none cursor-not-allowed" type="text" placeholder="DD.MM.ÅÅÅÅ" />
              </div>
            </div>
          </div>
        </section>
        </div>
      )}
    </div>
  );
}

export function DipsGuidePasFin({ countryName, docType, searchTimestamp, onBackToDocumentation }) {
  const [isFinancingOpen, setIsFinancingOpen] = useState(false);
  const [isFinancingModalOpen, setIsFinancingModalOpen] = useState(false);

  const [gyldigTil, setGyldigTil] = useState('');

  const computed = calculateEhicValidFrom({ countryName, validTo: gyldigTil, searchTimestamp });
  const computedGyldigFra = computed?.validFrom ? formatDate(computed.validFrom) : '';
  const computedNotes = computed?.notes || '';
  const validityStatus = computed?.reason === 'ok' ? 'ok' : computed?.reason === 'computed_after_search' ? 'after_search' : 'unknown';
  const gyldigFraClasses =
    validityStatus === 'ok'
      ? 'border-2 border-green-400 bg-green-50 text-green-950'
      : validityStatus === 'after_search'
        ? 'border-2 border-red-400 bg-red-50 text-red-950'
        : 'border-2 border-yellow-400 bg-yellow-50 text-gray-800';

  const gyldigTilIsInvalid = Boolean(gyldigTil) && computed?.reason === 'invalid_valid_to';
  const gyldigTilClasses = gyldigTilIsInvalid
    ? 'border-2 border-red-400 bg-red-50 text-red-950'
    : 'border border-gray-300 bg-white text-gray-900';

  const resolvedDocType = (docType || 'EHIC').trim() || 'EHIC';

  const financingContent = (
    <div className="p-5 bg-white border-t border-gray-200 space-y-5 text-sm">
      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl shadow-sm border border-blue-100">
        <p>
          Gyldig fra og med* skal helst være dato kortet er fremvist. Dette fordi fra dato er ulikt per land og fremkommer ikke alltid på kortet. Dersom kortet har en slutt-dato kan du ofte beregne fra-dato ved å trekke fra standard gyldighet for landet. Dette kan utføres i feltet under (Det er lagt inn en database med typisk gyldighetsdato for hvert land). Blir fra dato{' '}
          <span className="text-red-700 font-bold">rød</span>
          {' '}betyr det at EHIC er ugyldig og pasient bør fremstille PRC, naviger derfor tilbake{' '}
          <button type="button" onClick={onBackToDocumentation} className="font-semibold text-blue-700 underline hover:text-blue-800">
            her
          </button>
          {' '}og velg uten dokumentasjon eller PRC om dette innhentes av pasient.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Valgt dokument</p>
          <p className="font-bold text-gray-800">{resolvedDocType}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Land (regelgrunnlag)</p>
          <p className="font-bold text-gray-800">{countryName || '-'}</p>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-300 p-5 rounded-2xl relative">
        <span className="absolute -top-3 left-4 bg-white px-2 font-bold text-gray-600">Pasientfinansiering</span>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3 items-end">
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Pasientfinansieringstype</label>
            <select disabled className="w-full p-2.5 border-2 border-yellow-400 bg-yellow-50 rounded-lg outline-none text-gray-800 font-medium appearance-none cursor-not-allowed">
              <option>{resolvedDocType}</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Gyldig fra og med*</label>
            <input readOnly value={computedGyldigFra} className={`w-full p-2.5 rounded-lg outline-none cursor-not-allowed text-sm placeholder:text-[10px] ${gyldigFraClasses}`} placeholder="DD.MM.ÅÅÅÅ" />
          </div>

          <div className="md:col-span-3">
            <div className="bg-blue-50 text-blue-800 p-2 rounded-xl text-[11px] leading-snug border border-blue-100 mb-2">
              Du kan taste inn til dato for å beregne Gyldig fra og med dato
            </div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Gyldig til og med</label>
            <input value={gyldigTil} onChange={(e) => setGyldigTil(e.target.value)} className={`w-full p-2.5 rounded-lg outline-none text-sm placeholder:text-[10px] ${gyldigTilClasses}`} placeholder="DD.MM.ÅÅÅÅ" />
            {gyldigTilIsInvalid && (
              <div className="bg-red-50 text-red-900 p-2 rounded-xl text-[11px] leading-snug border border-red-200 mt-2">
                Skriv dato som DD.MM.ÅÅÅÅ (f.eks. 01.02.2026).
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Kortnummer (Felt 8)</label>
            <input readOnly value="1234" className="w-full p-2.5 border border-gray-300 bg-gray-50 rounded-lg outline-none cursor-not-allowed" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 items-end">
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Pasient-ID (Felt 6)</label>
            <input readOnly value="11223344" className="w-full p-2.5 border border-gray-300 bg-gray-50 rounded-lg outline-none cursor-not-allowed" />
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Trygdekontor (Felt 7, Navn)</label>
            <input readOnly value="ABCDE" className="w-full p-2.5 border border-gray-300 bg-gray-50 rounded-lg outline-none cursor-not-allowed" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Trygdekontornr (Felt 7, Nummer)</label>
            <input readOnly value="4422" className="w-full p-2.5 border border-gray-300 bg-gray-50 rounded-lg outline-none cursor-not-allowed" />
          </div>
        </div>

        <div className="mt-5 -mx-5 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 pt-4 pb-0">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">EHIC-kort (feltoversikt)</p>
          </div>

          <div className="w-full">
            <div className="relative overflow-hidden border-t border-slate-200 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="text-white/90">
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider">European Health Insurance Card</div>
                  <div className="mt-1 text-[11px] sm:text-sm font-semibold">KORTOVERSIKT</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-9 w-12 sm:h-10 sm:w-14 rounded-lg bg-white/15 border border-white/20" />
                  <div className="h-9 w-12 sm:h-10 sm:w-14 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white/90 text-xs font-bold">
                    EU
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-3">
                <div className="rounded-xl bg-white/95 border border-white/30 p-1.5 sm:p-2">
                  <div className="text-[10px] text-slate-600 font-semibold">Navn</div>
                  <div className="mt-1 h-4 sm:h-5 rounded-md bg-slate-100 px-1.5 flex items-center text-[10px] text-slate-700">John</div>
                </div>

                <div className="rounded-xl bg-white/95 border border-white/30 p-1.5 sm:p-2">
                  <div className="text-[10px] text-slate-600 font-semibold">Etternavn</div>
                  <div className="mt-1 h-4 sm:h-5 rounded-md bg-slate-100 px-1.5 flex items-center text-[10px] text-slate-700">Doe</div>
                </div>

                <div className="rounded-xl bg-white/95 border border-white/30 p-1.5 sm:p-2">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-7">
                      <div className="text-[10px] text-slate-600 font-semibold">Dato utstedt</div>
                      <div className="mt-1 h-4 sm:h-5 rounded-md bg-slate-100 px-1.5 flex items-center text-[10px] text-slate-700">01/01/2020</div>
                    </div>
                    <div className="col-span-5 relative">
                      <div className="text-[10px] text-slate-600 font-semibold text-right">
                        Pasient-ID <span className="ml-1 inline-flex items-center rounded-full bg-emerald-200/90 px-1.5 py-0.5 text-[9px] font-bold text-emerald-900 border border-emerald-300">Felt 6</span>
                      </div>
                      <div className="mt-1 h-4 sm:h-5 rounded-md bg-slate-100 px-1.5 flex items-center justify-end text-[10px] text-slate-700">11223344</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-white/95 border border-white/30 p-1.5 sm:p-2">
                  <div className="text-[10px] text-slate-600 font-semibold text-right whitespace-nowrap">
                    Trygdekontonummer <span className="ml-1 inline-flex items-center rounded-full bg-amber-200/90 px-1.5 py-0.5 text-[9px] font-bold text-amber-900 border border-amber-300">Felt 7</span>{' '}
                    Trygdenavn <span className="ml-1 inline-flex items-center rounded-full bg-amber-200/90 px-1.5 py-0.5 text-[9px] font-bold text-amber-900 border border-amber-300">Felt 7</span>
                  </div>
                  <div className="mt-1 flex justify-end gap-2">
                    <div className="h-4 sm:h-5 w-52 sm:w-60 rounded-md bg-slate-100 px-1.5 flex items-center justify-end text-[10px] text-slate-700">4422 - ABCDE</div>
                  </div>
                </div>

                <div className="rounded-xl bg-white/95 border border-white/30 p-1.5 sm:p-2">
                  <div className="flex items-end justify-between gap-2">
                    <div className="w-44 sm:w-56">
                      <div className="text-[10px] text-slate-600 font-semibold whitespace-nowrap">
                        Kortnummer <span className="ml-1 inline-flex items-center rounded-full bg-sky-200/90 px-1.5 py-0.5 text-[9px] font-bold text-sky-900 border border-sky-300">Felt 8</span>
                      </div>
                      <div className="mt-1 h-4 sm:h-5 rounded-md bg-slate-100 px-1.5 flex items-center text-[10px] text-slate-700">1234</div>
                    </div>
                    <div className="w-28 sm:w-32">
                      <div className="text-[10px] text-slate-600 font-semibold text-right whitespace-nowrap">
                        Gyldig til <span className="ml-1 inline-flex items-center rounded-full bg-rose-200/90 px-1.5 py-0.5 text-[9px] font-bold text-rose-900 border border-rose-300">Felt 9</span>
                      </div>
                      <div className="mt-1 h-4 sm:h-5 rounded-md bg-slate-100 px-1.5 flex items-center justify-end text-[10px] text-slate-700">01/01/2025</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
      <button
        onClick={() => setIsFinancingModalOpen(true)}
        className="sm:hidden w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-bold text-gray-800 flex items-center">
          <Wallet className="h-5 w-5 mr-3 text-blue-600" />
          Veiledning for felter i DIPS Pasientfinansiering
        </span>
        <ChevronDown className="h-5 w-5 text-gray-500" />
      </button>

      <button
        onClick={() => setIsFinancingOpen(!isFinancingOpen)}
        className="hidden sm:flex w-full items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-bold text-gray-800 flex items-center">
          <Wallet className="h-5 w-5 mr-3 text-blue-600" />
          Veiledning for felter i DIPS Pasientfinansiering
        </span>
        {isFinancingOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>

      <div className="hidden sm:block">{isFinancingOpen && financingContent}</div>

      {isFinancingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 relative">
          <button
            type="button"
            aria-label="Lukk"
            onClick={() => setIsFinancingModalOpen(false)}
            className="absolute inset-0 bg-black/40 z-0"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 flex flex-col"
          >
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="font-bold text-gray-800">Veiledning for felter i DIPS Pasientfinansiering</div>
              <button
                type="button"
                onClick={() => setIsFinancingModalOpen(false)}
                className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Lukk
              </button>
            </div>
            <div className="overflow-auto">{financingContent}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DipsGuide({ trygdenasjon }) {
  return (
    <div className="mt-8 space-y-4">
      <DipsGuidePasReg trygdenasjon={trygdenasjon} />
      <DipsGuidePasFin />
    </div>
  );
}
