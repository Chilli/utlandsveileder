export const COUNTRIES = [
  { name: 'Sverige', code: 'SE', zone: 'Norden' }, { name: 'Danmark', code: 'DK', zone: 'Norden' },
  { name: 'Finland', code: 'FI', zone: 'Norden' }, { name: 'Island', code: 'IS', zone: 'Norden' },
  { name: 'Færøyene', code: 'FO', zone: 'Norden' }, { name: 'Grønland', code: 'GL', zone: 'Norden' },
  { name: 'Åland', code: 'AX', zone: 'Norden' },
  { name: 'Belgia', code: 'BE', zone: 'EU_EOS' }, { name: 'Bulgaria', code: 'BG', zone: 'EU_EOS' },
  { name: 'Estland', code: 'EE', zone: 'EU_EOS' }, { name: 'Frankrike', code: 'FR', zone: 'EU_EOS' },
  { name: 'Hellas', code: 'GR', zone: 'EU_EOS' }, { name: 'Irland', code: 'IE', zone: 'EU_EOS' },
  { name: 'Italia', code: 'IT', zone: 'EU_EOS' }, { name: 'Kroatia', code: 'HR', zone: 'EU_EOS' },
  { name: 'Kypros', code: 'CY', zone: 'EU_EOS' }, { name: 'Latvia', code: 'LV', zone: 'EU_EOS' },
  { name: 'Liechtenstein', code: 'LI', zone: 'EU_EOS' }, { name: 'Litauen', code: 'LT', zone: 'EU_EOS' },
  { name: 'Luxembourg', code: 'LU', zone: 'EU_EOS' }, { name: 'Malta', code: 'MT', zone: 'EU_EOS' },
  { name: 'Nederland', code: 'NL', zone: 'EU_EOS' }, { name: 'Polen', code: 'PL', zone: 'EU_EOS' },
  { name: 'Portugal', code: 'PT', zone: 'EU_EOS' }, { name: 'Romania', code: 'RO', zone: 'EU_EOS' },
  { name: 'Slovakia', code: 'SK', zone: 'EU_EOS' }, { name: 'Slovenia', code: 'SI', zone: 'EU_EOS' },
  { name: 'Spania', code: 'ES', zone: 'EU_EOS' }, { name: 'Sveits', code: 'CH', zone: 'EU_EOS' },
  { name: 'Tyskland', code: 'DE', zone: 'EU_EOS' }, { name: 'Tsjekkia', code: 'CZ', zone: 'EU_EOS' },
  { name: 'Ungarn', code: 'HU', zone: 'EU_EOS' }, { name: 'Østerrike', code: 'AT', zone: 'EU_EOS' },
  { name: 'Storbritannia (UK)', code: 'GB', zone: 'Konvensjon' }, { name: 'Australia', code: 'AU', zone: 'Konvensjon' },
  { name: 'Bosnia-Hercegovina', code: 'BA', zone: 'Konvensjon' }, { name: 'Montenegro', code: 'ME', zone: 'Konvensjon' },
  { name: 'Serbia', code: 'RS', zone: 'Konvensjon' }, { name: 'Tyrkia', code: 'TR', zone: 'Konvensjon' },
  { name: 'Canada (Quebec)', code: 'CA-QC', zone: 'Konvensjon' },
  { name: 'Afghanistan', code: 'AF', zone: 'Andre' }, { name: 'Albania', code: 'AL', zone: 'Andre' },
  { name: 'Algerie', code: 'DZ', zone: 'Andre' }, { name: 'Argentina', code: 'AR', zone: 'Andre' },
  { name: 'Armenia', code: 'AM', zone: 'Andre' }, { name: 'Aserbajdsjan', code: 'AZ', zone: 'Andre' },
  { name: 'Bangladesh', code: 'BD', zone: 'Andre' }, { name: 'Brasil', code: 'BR', zone: 'Andre' },
  { name: 'Canada (Øvrig)', code: 'CA', zone: 'Andre' }, { name: 'Chile', code: 'CL', zone: 'Andre' },
  { name: 'Colombia', code: 'CO', zone: 'Andre' }, { name: 'De forente arabiske emirater', code: 'AE', zone: 'Andre' },
  { name: 'Egypt', code: 'EG', zone: 'Andre' }, { name: 'Filippinene', code: 'PH', zone: 'Andre' },
  { name: 'Georgia', code: 'GE', zone: 'Andre' }, { name: 'India', code: 'IN', zone: 'Andre' },
  { name: 'Indonesia', code: 'ID', zone: 'Andre' }, { name: 'Irak', code: 'IQ', zone: 'Andre' },
  { name: 'Iran', code: 'IR', zone: 'Andre' }, { name: 'Israel', code: 'IL', zone: 'Andre' },
  { name: 'Japan', code: 'JP', zone: 'Andre' }, { name: 'Kina', code: 'CN', zone: 'Andre' },
  { name: 'Libanon', code: 'LB', zone: 'Andre' }, { name: 'Marokko', code: 'MA', zone: 'Andre' },
  { name: 'Mexico', code: 'MX', zone: 'Andre' }, { name: 'New Zealand', code: 'NZ', zone: 'Andre' },
  { name: 'Nord-Makedonia', code: 'MK', zone: 'Andre' }, { name: 'Pakistan', code: 'PK', zone: 'Andre' },
  { name: 'Russland', code: 'RU', zone: 'Andre' }, { name: 'Saudi-Arabia', code: 'SA', zone: 'Andre' },
  { name: 'Somalia', code: 'SO', zone: 'Andre' }, { name: 'Sør-Afrika', code: 'ZA', zone: 'Andre' },
  { name: 'Sør-Korea', code: 'KR', zone: 'Andre' }, { name: 'Syria', code: 'SY', zone: 'Andre' },
  { name: 'Thailand', code: 'TH', zone: 'Andre' }, { name: 'Ukraina', code: 'UA', zone: 'Andre' },
  { name: 'USA', code: 'US', zone: 'Andre' }, { name: 'Vietnam', code: 'VN', zone: 'Andre' },
];

export const CIRCUMSTANCES = [
  { id: 'none', label: 'Ingen spesielle omstendigheter' },
  { id: 'worker', label: 'Arbeidstaker i Norge' },
  { id: 'pregnancy', label: 'Svangerskap' },
  { id: 'psychiatry', label: 'Psykriatri' },
  { id: 'family_reunification', label: 'Familiegjenforening (Familieinnvandring)' },
  { id: 'asylum', label: 'Asylsøker / Flyktning' },
  { id: 'child', label: 'Pasient under 18 år' },
  { id: 'prisoner', label: 'Innsatt i fengsel' },
  { id: 'student_outside', label: 'Student fra land utenfor EØS' },
];

export const STEPS = [
  { id: 1, label: 'Nasjon' },
  { id: 2, label: 'Omstendigheter' },
  { id: 3, label: 'Dokumentasjon' },
  { id: 4, label: 'Registrering' }
];

export const DOCUMENT_OPTIONS = {
  pass: { label: 'Pass eller annet gyldig nasjonalt ID-kort', icon: 'IdCard' },
  ehic_helfo: { label: 'Gyldig Europeisk helsetrygdkort (EHIC) eller bekreftelse på helserettigheter fra HELFO', icon: 'CreditCard' },
  prc: { label: 'Hasteblankett (PRC)', icon: 'FileText' },
  arbeid_docs: { label: 'Gyldig arbeidskontrakt, skattekort og lønnslipp (alle tre må fremlegges)', icon: 'Briefcase' },
  address: { label: 'Bevis på bostedsadresse i et annet nordisk land', icon: 'Home' },
  ehic: { label: 'Gyldig Europeisk helsetrygdkort (EHIC)', icon: 'CreditCard' },
  s1: { label: 'Rettighetsdokument S1 / S072', icon: 'FileText' },
  s2: { label: 'Rettighetsdokument S2', icon: 'FileText' },
  s3: { label: 'Rettighetsdokument S3', icon: 'FileText' },
  s2_planned: { label: 'Gyldig S2-skjema fra hjemlandet', icon: 'FileText' },
  trygdebevis: { label: 'Trygdebevis/Nasjonalt ID fra avtalelandet', icon: 'CreditCard' },
  address_home: { label: 'Bostedsadresse i hjemlandet', icon: 'Home' },
  asylum_certificate: { label: 'Registreringsbevis for asylsøker / Asylsøkerbevis', icon: 'FileText' },
  asylum_address_norway: { label: 'Adresse i Norge', icon: 'Home' },
  asylum_no_docs: { label: 'Har ingen dokumentasjon eller har ikke søkt asyl', icon: 'AlertCircle' },
};

export const DOCUMENTATION_SCENARIOS = {
  worker_eu_eos: {
    groups: [
      { title: 'Kreves i tillegg (Alltid påkrevd):', documents: ['pass'] },
      { title: 'Velg én av følgende:', documents: ['ehic_helfo', 'prc', 'arbeid_docs'] },
    ],
    requirements: { allOf: ['pass'], oneOf: ['ehic_helfo', 'prc', 'arbeid_docs'] },
  },
  worker_other: {
    groups: [
      { title: 'Alltid påkrevd:', documents: ['pass'] },
      { title: 'I tillegg:', documents: ['arbeid_docs'] },
    ],
    requirements: { allOf: ['pass', 'arbeid_docs'] },
  },
  asylum: {
    groups: [
      { title: 'Registreringsbevis for asylsøker / Asylsøkerbevis', documents: ['asylum_certificate'] },
      { title: 'I tillegg', documents: ['asylum_address_norway'] },
      { title: 'Har ingen dokumentasjon eller søkt asyl', documents: ['asylum_no_docs'] },
    ],
    requirements: { allOf: ['asylum_certificate', 'asylum_address_norway'] },
  },
  norden: {
    groups: [
      { title: 'Alltid påkrevd:', documents: ['pass'] },
      { title: 'I tillegg:', documents: ['address'] },
    ],
    requirements: { allOf: ['pass', 'address'] },
  },
  eu_eos_acute: {
    groups: [
      { title: 'Alltid påkrevd:', documents: ['pass'] },
      { title: 'I tillegg må ett av følgende fremvises:', documents: ['ehic', 'prc', 's1', 's2', 's3'] },
    ],
    requirements: { allOf: ['pass'], oneOf: ['ehic', 'prc', 's1', 's2', 's3'] },
  },
  eu_eos_planned: {
    groups: [
      { title: 'Alltid påkrevd:', documents: ['pass'] },
      { title: 'I tillegg:', documents: ['s2_planned'] },
    ],
    requirements: { allOf: ['pass', 's2_planned'] },
  },
  konvensjon: {
    groups: [
      { title: 'Alltid påkrevd:', documents: ['pass'] },
      { title: 'I tillegg:', documents: ['trygdebevis'] },
    ],
    requirements: { allOf: ['pass', 'trygdebevis'] },
  },
  andre: {
    groups: [
      { title: 'Alltid påkrevd:', documents: ['pass'] },
      { title: 'I tillegg:', documents: ['address_home'] },
    ],
    requirements: { allOf: ['pass', 'address_home'] },
    infoType: 'andre_info',
  },
};
