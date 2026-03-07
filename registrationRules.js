import { DOCUMENTATION_SCENARIOS } from './registrationConfig.js';

export function getDocumentationScenario(data) {
  if (!data.country || !data.circumstance) {
    return null;
  }

  if (data.circumstance === 'worker') {
    return data.country.zone === 'EU_EOS' ? 'worker_eu_eos' : 'worker_other';
  }

  if (data.circumstance === 'asylum') {
    return 'asylum';
  }

  if (data.circumstance === 'family_reunification') {
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
    if (data.need === 'acute') {
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
  if (data?.circumstance === 'asylum' && selectedDocs.includes('asylum_no_docs')) {
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
  const { country, circumstance, need, hasDoc } = data;
  let res = null;

  if (circumstance === 'worker') {
    if (hasDoc === true) {
      res = {
        type: 'success',
        trygdenasjon: 'Norge',
        finansiering: 'Folketrygden / Vanlig egenandel',
        beskrivelse: 'Pasienten har gyldig dokumentasjon på helserettigheter/arbeidsforhold i Norge.',
        handling: 'Kopier pass og fremvist dokumentasjon (EHIC/Helfo-vedtak, eller arbeidskontrakt/skattekort/lønnsslipp).'
      };
    } else {
      res = {
        type: 'error',
        trygdenasjon: country ? country.name : 'Ukjent',
        finansiering: 'Selvbetalende',
        beskrivelse: 'Pasienten mangler dokumentasjon på arbeidsforhold eller helserettigheter i Norge.',
        handling: 'Pasienten registreres som selvbetalende inntil gyldig dokumentasjon kan fremvises.'
      };
    }
  } else if (circumstance === 'family_reunification') {
    res = {
      type: hasDoc === true ? 'warning' : 'error',
      trygdenasjon: country ? country.name : 'Ukjent',
      finansiering: 'Selvbetalende',
      beskrivelse: 'Pasienter som oppholder seg i Norge mens søknad om familiegjenforening/familieinnvandring behandles, har som hovedregel ikke helserettigheter i Norge ennå og registreres derfor som selvbetalende. Kun øyeblikkelig hjelp dekkes.',
      handling: hasDoc === true
        ? 'Kopier fremvist legitimasjon og dokumentasjon for adresse/tilhørighet. Pasienten registreres som selvbetalende. Merk at graviditet i seg selv ikke gir dekning fra Norge mens søknaden fortsatt er til behandling.'
        : 'Pasienten registreres som selvbetalende. Innhent legitimasjon og adresseopplysninger så snart som mulig for korrekt registrering og fakturagrunnlag. Merk at graviditet i seg selv ikke gir dekning fra Norge mens søknaden fortsatt er til behandling.'
    };
  } else if (circumstance === 'asylum') {
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
  } else if (circumstance === 'prisoner') {
    res = {
      type: 'success',
      trygdenasjon: 'Norge',
      finansiering: 'Kriminalomsorgen',
      beskrivelse: 'Kriminalomsorgen dekker utgifter til helsehjelp for innsatte.',
      handling: 'Faktura for helsehjelp og evt. egenandel sendes den aktuelle anstalten.'
    };
  } else if (circumstance === 'undocumented') {
    res = {
      type: 'warning',
      trygdenasjon: country ? country.name : 'Ukjent',
      finansiering: 'Selvbetalende',
      beskrivelse: 'Personer uten lovlig opphold har kun rett til akutt (nødvendig) helsehjelp som ikke kan vente.',
      handling: 'Skal i utgangspunktet betale selv. Helsehjelp kan uansett ikke nektes ved akutt behov. Staten dekker evt. tap i etterkant.'
    };
  } else if (circumstance === 'child') {
    res = {
      type: 'success',
      trygdenasjon: country ? country.name : 'Norge',
      finansiering: 'Folketrygden / Fritak',
      beskrivelse: 'Barn under 16 år har fulle rettigheter og fritak for egenandel.',
      handling: 'Sørg for at alder er riktig registrert.'
    };
  } else if (!country) {
    return null;
  } else if (country.zone === 'Norden') {
    if (hasDoc === true) {
      res = {
        type: 'success',
        trygdenasjon: country.name,
        finansiering: 'Nordisk avtale / Helfo',
        beskrivelse: 'Pasienten dekkes av nordisk trygdeavtale.',
        handling: 'Kopier offentlig ID med bostedsadresse (f.eks. førerkort/pass).'
      };
    } else if (hasDoc === false) {
      res = {
        type: 'error',
        trygdenasjon: country.name,
        finansiering: 'Selvbetalende',
        beskrivelse: 'Mangler gyldig ID som bekrefter bosted i Norden.',
        handling: 'Registreres som selvbetalende. Pasienten må kreve refusjon fra hjemlandet i etterkant.'
      };
    }
  } else if (country.zone === 'EU_EOS') {
    if (need === 'acute' && hasDoc === true) {
      res = {
        type: 'success',
        trygdenasjon: country.name,
        finansiering: 'EU/EØS / Helfo',
        beskrivelse: 'Akutt helsehjelp dekkes via Europeisk Helsetrygdkort (EHIC).',
        handling: 'Legg inn EHIC-kortnummer og utløpsdato i DIPS. Ta kopi av kortet.'
      };
    } else if (need === 'planned' && hasDoc === true) {
      res = {
        type: 'success',
        trygdenasjon: country.name,
        finansiering: 'EU/EØS / Helfo',
        beskrivelse: 'Planlagt helsehjelp dekkes via S2-skjema.',
        handling: 'S2-skjema må scannes og registreres i pasientens journal.'
      };
    } else if (hasDoc === false) {
      res = {
        type: 'error',
        trygdenasjon: country.name,
        finansiering: 'Selvbetalende',
        beskrivelse: 'Pasienten mangler gyldig dokumentasjon (EHIC / S2).',
        handling: 'Pasienten må betale full pris selv og søke refusjon i hjemlandet.'
      };
    }
  } else if (country.zone === 'Konvensjon') {
    if (need === 'acute' && hasDoc === true) {
      res = {
        type: 'success',
        trygdenasjon: country.name,
        finansiering: 'Konvensjon / Helfo',
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
        handling: 'Pasienten må betale full pris og registreres som selvbetalende. Pasienten må selv ta kontakt med sitt forsikringsselskap ved mottakelse av faktura. Akutt livreddende hjelp ytes uansett betalingsevne.'
      };
    } else {
      res = {
        type: 'error',
        trygdenasjon: country.name,
        finansiering: 'Selvbetalende / Privat',
        beskrivelse: 'Norge har ingen trygdeavtale med dette landet. Pasienten mangler også gyldig ID/adresse.',
        handling: 'Registreres som ukjent/selvbetalende inntil ID fremvises. Faktura sendes basert på tilgjengelig informasjon. Pasienten må selv kontakte sitt forsikringsselskap.'
      };
    }
  }

  if (res && circumstance === 'pregnancy') {
    res.beskrivelse += ' (Merk: Helsehjelp i forbindelse med svangerskap og fødsel regnes som nødvendig helsehjelp og kan ikke nektes, uavhengig av finansiering og oppholdsstatus.)';
  }

  return res;
}
