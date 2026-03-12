import { DOCUMENTATION_SCENARIOS } from './registrationConfig.js';

const normalizeCountryName = (name) => (name || '').trim().toLowerCase();

const EHIC_VALIDITY_YEARS_BY_COUNTRY = {
  belgia: { years: 2, notes: '' },
  bulgaria: { years: 1, notes: '' },
  danmark: { years: 5, notes: '' },
  estland: { years: 3, notes: '' },
  finland: { years: 5, notes: 'Tidligere 2 år, men ble utvidet til 5 år fra Januar 2026.' },
  frankrike: { years: 2, notes: 'Kan enkelt fornyes gjennom en digital portal.' },
  hellas: { years: 1, notes: '' },
  irland: { years: 4, notes: 'Som regel 4 år, men for enkelte som ikke har fast bosted er det kortere.' },
  island: { years: 3, notes: '' },
  italia: { years: 6, notes: '' },
  kroatia: { years: 3, notes: '' },
  kypros: { years: 2, notes: '' },
  latvia: { years: 3, notes: '' },
  liechtenstein: { years: 1, notes: '' },
  litauen: { years: 2, notes: '' },
  luxembourg: { years: 2, notes: '' },
  malta: { years: 2, notes: '' },
  nederland: { years: 5, notes: '' },
  norge: { years: 3, notes: '' },
  polen: { years: 3, notes: '' },
  portugal: { years: 3, notes: '' },
  romania: { years: 2, notes: '' },
  slovakia: { years: 5, notes: '' },
  slovenia: { years: 1, notes: '' },
  spania: { years: 2, notes: 'Normalt med 2 år men kan være lenger for pensjonister' },
  sverige: { years: 3, notes: '' },
  tsjekkia: { years: 5, notes: '' },
  tyskland: { years: null, notes: '1–5 år' },
  ungarn: { years: 3, notes: '' },
  østerrike: { years: 5, notes: '' },
  'storbritannia (uk)': { years: 5, notes: 'Erstattet EHIC når Storbritania gikk ut av EU.' },
};

const parseNorwegianDate = (value) => {
  if (!value) return null;
  const raw = String(value).trim();
  const match = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const d = new Date(year, month - 1, day);
  if (Number.isNaN(d.getTime())) return null;
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return d;
};

const subtractYears = (date, years) => {
  const d = date instanceof Date ? new Date(date) : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const copy = new Date(d);
  copy.setFullYear(copy.getFullYear() - years);
  return copy;
};

export function calculateEhicValidFrom({ countryName, validTo, searchTimestamp }) {
  const countryKey = normalizeCountryName(countryName);
  if (!countryKey) {
    return { validFrom: null, years: null, notes: '', reason: 'missing_country' };
  }

  const rule = EHIC_VALIDITY_YEARS_BY_COUNTRY[countryKey];
  if (!rule) {
    return { validFrom: null, years: null, notes: '', reason: 'unknown_country' };
  }

  if (!rule.years) {
    return { validFrom: null, years: rule.years, notes: rule.notes, reason: 'varies' };
  }

  const parsedValidTo = parseNorwegianDate(validTo);
  if (!parsedValidTo) {
    return { validFrom: null, years: rule.years, notes: rule.notes, reason: 'invalid_valid_to' };
  }

  const computed = subtractYears(parsedValidTo, rule.years);
  if (!computed) {
    return { validFrom: null, years: rule.years, notes: rule.notes, reason: 'compute_failed' };
  }

  if (searchTimestamp) {
    const searchedAt = new Date(searchTimestamp);
    if (!Number.isNaN(searchedAt.getTime()) && computed.getTime() > searchedAt.getTime()) {
      return { validFrom: computed, years: rule.years, notes: rule.notes, reason: 'computed_after_search' };
    }
  }

  return { validFrom: computed, years: rule.years, notes: rule.notes, reason: 'ok' };
}

function getSelectedCircumstances(data) {
  return data?.circumstances || (data?.circumstance ? [data.circumstance] : []);
}

function hasCircumstance(data, circumstanceId) {
  return getSelectedCircumstances(data).includes(circumstanceId);
}

export function getDocumentationScenario(data) {
  if (data?.isUndocumented) {
    return null;
  }

  if (!data.country || (getSelectedCircumstances(data).length === 0 && !data?.circumstance)) {
    return null;
  }

  if (hasCircumstance(data, 'asylum')) {
    return 'asylum';
  }

  if (hasCircumstance(data, 'child') && data.country.zone === 'EU_EOS') {
    return 'eu_eos_acute';
  }

  if (hasCircumstance(data, 'worker')) {
    return data.country.zone === 'EU_EOS' ? 'worker_eu_eos' : 'worker_other';
  }

  if (hasCircumstance(data, 'family_reunification')) {
    if (data.country.zone === 'Norden') {
      return 'norden';
    }

    if (data.country.zone === 'Konvensjon') {
      return 'konvensjon';
    }

    return 'andre';
  }

  if (data.country.zone === 'Norden') {
    return 'norden';
  }

  if (data.country.zone === 'EU_EOS') {
    if (data.need === 'acute' || data.need === 'coercion') {
      return 'eu_eos_acute';
    }

    if (data.need === 'planned') {
      return 'eu_eos_planned';
    }
  }

  if (data.country.zone === 'Konvensjon') {
    return 'konvensjon';
  }

  if (data.country.zone === 'Andre') {
    return 'andre';
  }

  return null;
}

export function isDocumentationSufficient(data, selectedDocs) {
  if (hasCircumstance(data, 'asylum') && selectedDocs.includes('asylum_no_docs')) {
    return false;
  }

  const scenarioKey = getDocumentationScenario(data);

  if (!scenarioKey) {
    return false;
  }

  const scenario = DOCUMENTATION_SCENARIOS[scenarioKey];
  if (!scenario) {
    return false;
  }

  const { allOf = [], oneOf = [] } = scenario.requirements || {};
  const hasAllRequired = allOf.every((doc) => selectedDocs.includes(doc));
  const hasOneOptional = oneOf.length === 0 || oneOf.some((doc) => selectedDocs.includes(doc));

  return hasAllRequired && hasOneOptional;
}

export function calculateResult(data) {
  const { country, need, hasDoc } = data;
  const selectedCircumstances = getSelectedCircumstances(data);
  const hasChildCombination = hasCircumstance(data, 'child') && selectedCircumstances.length > 1;
  let res = null;

  if (data?.isUndocumented && hasCircumstance(data, 'child')) {
    res = {
      type: 'warning',
      trygdenasjon: 'Ukjent',
      finansiering: 'Selvbetalende',
      beskrivelse: 'Pasienter under 18 år uten lovlig opphold har rett til helsehjelp på lik linje med barn som er bosatt i Norge (full rett til nødvendig og planlagt helsehjelp).',
      handling: 'Registrer pasienten som selvbetalende (Takst: Ordinær takst + Uselvp). Faktura sendes til foreldre/verge. Sørg for at alder og vergeopplysninger er riktig registrert.'
    };
  } else if (data?.isUndocumented) {
    res = {
      type: 'warning',
      trygdenasjon: 'Ukjent',
      finansiering: 'Selvbetalende',
      beskrivelse: 'Personer uten lovlig opphold har kun rett til akutt nødvendig helsehjelp som ikke kan vente.',
      handling: 'Skal i utgangspunktet betale selv. Helsehjelp kan uansett ikke nektes ved akutt behov. Staten dekker eventuelt tap i etterkant.'
    };
  } else if (hasChildCombination) {
    if (country?.zone === 'Andre') {
      res = {
        type: 'warning',
        trygdenasjon: country.name,
        finansiering: 'Selvbetalende',
        beskrivelse: 'Barn under 18 år fra land uten EU/EØS- eller konvensjonsavtale har ingen offentlig dekning i Norge og registreres som selvbetalende.',
        handling: 'Registrer pasienten som selvbetalende (Takst: Ordinær takst + Uselvp). Faktura sendes til foreldre/verge. Sørg for at legitimasjon/adresse registreres så langt det lar seg gjøre.'
      };
    } else {
      res = {
        type: 'success',
        trygdenasjon: hasCircumstance(data, 'asylum') ? 'Norge' : country ? country.name : 'Ukjent',
        finansiering: 'Folketrygden / Fritak',
        beskrivelse: 'Pasient under 18 år som også omfattes av en annen omstendighet registreres uten egenandel.',
        handling: 'Registrer pasienten med fritak for egenandel. Sørg for at alder er riktig registrert.'
      };
    }
  } else if (hasCircumstance(data, 'worker')) {
    if (hasDoc === true) {
      res = {
        type: 'success',
        trygdenasjon: 'Norge',
        finansiering: 'Folketrygden / Vanlig egenandel',
        beskrivelse: 'Pasienten har gyldig dokumentasjon på helserettigheter/arbeidsforhold i Norge.',
        handling: 'Kopier pass. Kopier fremvist dokumentasjon. Dette kan være EHIC, Helfo-vedtak, arbeidskontrakt, skattekort eller lønnsslipp.'
      };
    } else {
      res = {
        type: 'warning',
        trygdenasjon: country ? country.name : 'Ukjent',
        finansiering: 'Selvbetalende',
        beskrivelse: 'Pasienten mangler dokumentasjon på arbeidsforhold eller helserettigheter i Norge.',
        handling: 'Pasienten registreres som selvbetalende inntil gyldig dokumentasjon kan fremvises.'
      };
    }
  } else if (hasCircumstance(data, 'family_reunification')) {
    res = {
      type: hasDoc === true ? 'warning' : 'error',
      trygdenasjon: country ? country.name : 'Ukjent',
      finansiering: 'Selvbetalende',
      beskrivelse: 'Pasienter som oppholder seg i Norge mens søknad om familiegjenforening/familieinnvandring behandles, har som hovedregel ikke helserettigheter i Norge ennå og registreres derfor som selvbetalende. Kun øyeblikkelig hjelp dekkes.',
      handling: hasDoc === true
        ? 'Kopier fremvist legitimasjon og dokumentasjon for adresse/tilhørighet. Pasienten registreres som selvbetalende. Merk at graviditet i seg selv ikke gir dekning fra Norge mens søknaden fortsatt er til behandling.'
        : 'Pasienten registreres som selvbetalende. Innhent legitimasjon og adresseopplysninger så snart som mulig for korrekt registrering og fakturagrunnlag. Merk at graviditet i seg selv ikke gir dekning fra Norge mens søknaden fortsatt er til behandling.'
    };
  } else if (hasCircumstance(data, 'asylum')) {
    if (hasDoc === true) {
      res = {
        type: 'success',
        trygdenasjon: 'Norge (evt. opprinnelsesland)',
        finansiering: 'Folketrygden / Helfo',
        beskrivelse: 'Asylsøkere har rett til helsehjelp fra ankomstdato når asylstatus og bosted i Norge er dokumentert.',
        handling: 'Registrer asylsøkerbevis/registreringsbevis og bostedadresse i Norge. Dokumentasjonen skal kopieres/scannes i henhold til lokale rutiner.'
      };
    } else {
      res = {
        type: 'error',
        trygdenasjon: country ? country.name : 'Ukjent',
        finansiering: 'Selvbetalende',
        beskrivelse: 'Pasienten har ikke fremvist asylsøkerbevis/registreringsbevis eller adresse i Norge, eller har ikke søkt asyl. Pasienten registreres som selvbetalende inntil rettigheter kan avklares.',
        handling: 'Status må avklares før rettigheter kan registreres. Pasient må innhente asylsøkerbevis/registreringsbevis og bostedadresse i Norge og ettersende dette til helseforetaket.'
      };
    }
  } else if (hasCircumstance(data, 'prisoner')) {
    res = {
      type: 'success',
      trygdenasjon: 'Norge',
      finansiering: 'Kriminalomsorgen',
      beskrivelse: 'Kriminalomsorgen dekker utgifter til helsehjelp for innsatte.',
      handling: 'Faktura for helsehjelp og evt. egenandel sendes den aktuelle anstalten.'
    };
  } else if (hasCircumstance(data, 'child')) {
    if (country?.zone === 'Andre') {
      res = {
        type: 'warning',
        trygdenasjon: country.name,
        finansiering: 'Selvbetalende',
        beskrivelse: 'Barn under 18 år fra land uten EU/EØS- eller konvensjonsavtale har ingen offentlig dekning i Norge og registreres som selvbetalende, selv om de har utvidede rettigheter til helsehjelp.',
        handling: 'Registrer pasienten som selvbetalende (Takst: Ordinær takst + Uselvp). Faktura sendes til foreldre/verge. Barn og unge under 18 år skal få nødvendig helsehjelp på lik linje med barn bosatt i Norge.'
      };
    } else if (country?.zone === 'EU_EOS') {
      if (hasDoc === true) {
        res = {
          type: 'success',
          trygdenasjon: country.name,
          finansiering: 'EU/EØS / Fritak for egenandel',
          beskrivelse: 'Pasient under 18 år fra EU/EØS må dokumentere helserettigheter på lik linje med andre EU/EØS-borgere for å unngå selvbetalende. Barn og unge under 18 år har utvidede rettigheter til helsehjelp.',
          handling: 'Registrer gyldig rettighetsdokumentasjon. Sørg for at pasienten registreres uten egenandel.'
        };
      } else if (hasDoc === false) {
        res = {
          type: 'error',
          trygdenasjon: country.name,
          finansiering: 'Selvbetalende',
          beskrivelse: 'Pasienten mangler gyldig dokumentasjon på nåværende tidpunkt og vil dermed måtte betale selv',
          handling: 'Pasienten blir selvbetalende, velg frikode Selvbetalende og legg til takst, for eksempel 201b\nHar pasienten allerede fått utstedt EHIC men har det ikke fysisk med seg, kan dette snarest sendes kopi av (begge sider) og registreres i Pasientfinansiering i DIPS.\nPasienten kan unngå å bli selvbetalende ved å innhente hasteblanket (PRC) fra sitt hjemland.\nFaktura sendes til registrert adresse.'
        };
      }
    } else {
      res = {
        type: 'success',
        trygdenasjon: country ? country.name : 'Norge',
        finansiering: 'Folketrygden / Fritak',
        beskrivelse: 'Pasient under 18 år har fritak for egenandel.',
        handling: 'Sørg for at alder er riktig registrert.'
      };
    }
  } else if (!country) {
    return null;
  } else if (country.zone === 'Norden') {
    if (hasDoc === true) {
      res = {
        type: 'success',
        trygdenasjon: country.name,
        finansiering: 'Nordisk avtale / Helfo',
        beskrivelse: 'Pasienten dekkes av nordisk trygdeavtale.',
        handling: 'Pasienten betaler vanlig egenandel.\nKopier offentlig ID med bostedsadresse (f.eks førerkort/pass).'
      };
    } else if (hasDoc === false) {
      res = {
        type: 'error',
        trygdenasjon: country.name,
        finansiering: 'Selvbetalende',
        beskrivelse: 'Mangler gyldig ID som bekrefter bosted i Norden.',
        handling: 'Pasienten blir selvbetalende, velg frikode Selvbetalende og legg til takst, for eksempel 201b.\nPasienten må kreve refusjon fra hjemlandet sitt i etterkant.'
      };
    }
  } else if (country.zone === 'EU_EOS') {
    if ((need === 'acute' || need === 'coercion') && hasDoc === true) {
      res = {
        type: 'success',
        trygdenasjon: country.name,
        finansiering: 'Konvensjonsavtale / Helfo',
        beskrivelse: 'Akutt helsehjelp dekkes når helserettigheter er dokumentert.',
        handling: 'Registrer dokumentert helserettighet i DIPS i henhold til lokale rutiner. Ta kopi av fremvist dokumentasjon.'
      };
    } else if (need === 'planned' && hasDoc === true) {
      res = {
        type: 'success',
        trygdenasjon: country.name,
        finansiering: 'Konvensjonsavtale / Helfo',
        beskrivelse: 'Planlagt helsehjelp dekkes når helserettigheter er dokumentert.',
        handling: 'Rettighetsdokumentasjon må scannes og registreres i pasientens journal i henhold til lokale rutiner.'
      };
    } else if (hasDoc === false) {
      res = {
        type: 'error',
        trygdenasjon: country.name,
        finansiering: 'Selvbetalende',
        beskrivelse: 'Pasienten mangler gyldig dokumentasjon på nåværende tidspunkt og vil dermed måtte betale selv',
        handling: 'Pasienten blir selvbetalende, velg frikode Selvbetalende og legg til takst, for eksempel 201b\nHar pasienten allerede fått utstedt EHIC men har det ikke fysisk med seg, kan dette snarest sendes kopi av (Begge sider) og registeres i Pasientfinansiering i DIPS.\nPasienten kan unngå å bli selvbetalende ved å innhente hasteblanket (PRC) fra sitt hjemland.\nFaktura sendes til registrert adresse.'
      };
    }
  } else if (country.zone === 'Konvensjon') {
    if ((need === 'acute' || need === 'coercion') && hasDoc === true) {
      res = {
        type: 'success',
        trygdenasjon: country.name,
        finansiering: 'Konvensjonsavtale / Helfo',
        beskrivelse: 'Helsehjelp dekkes via bilateral avtale.',
        handling: `Ta kopi av gyldig nasjonalt dokument (f.eks. GHIC / pass fra ${country.name}).`
      };
    } else if (hasDoc === false) {
      res = {
        type: 'error',
        trygdenasjon: country.name,
        finansiering: 'Selvbetalende',
        beskrivelse: 'Mangler nødvendig dokumentasjon under konvensjonsavtalen.',
        handling: 'Krever full egenbetaling.'
      };
    }
  } else if (country.zone === 'Andre') {
    if (hasDoc === true) {
      res = {
        type: 'warning',
        trygdenasjon: country.name,
        finansiering: 'Selvbetalende / Privat',
        beskrivelse: 'Norge har ingen trygdeavtale med dette landet.',
        handling: 'Pasienten blir selvbetalende, velg frikode Selvbetalende og legg til takst, for eksempel 201b\nFaktura sendes til registrert adresse.\nPasienten må selv kontakte sitt forsikringsselskap.'
      };
    } else {
      res = {
        type: 'error',
        trygdenasjon: country.name,
        finansiering: 'Selvbetalende / Privat',
        beskrivelse: 'Norge har ingen trygdeavtale med dette landet. Pasienten mangler også gyldig ID/adresse.',
        handling: 'Pasienten blir selvbetalende, velg frikode Selvbetalende og legg til takst, for eksempel 201b\nFaktura sendes til registrert adresse.\nPasienten må selv kontakte sitt forsikringsselskap.'
      };
    }
  }

  if (res?.finansiering?.includes('Selvbetalende')) {
    res.type = 'error';
  }

  return res;
}
