import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function DipsGuide({ trygdenasjon }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-bold text-gray-800 flex items-center">
          <Info className="h-5 w-5 mr-3 text-blue-600" />
          Vis veiledning for felter i DIPS
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
