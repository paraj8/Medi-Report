import {
  downloadApplicationPdf,
  formatApplicationCounts,
  printApplication,
  type ApplicationParagraph,
  type ApplicationReportData,
} from './applicationPdf';

export function getLipikParagraphs(data: ApplicationReportData): ApplicationParagraph[] {
  const values = formatApplicationCounts(data);
  const cases = `ekg ${values.month} ${values.year} esa lQy okn ${values.successful} ,oa vlQy oknksa fd la[;k ${values.unsuccessful} gSA dqy lQy okn ${values.successful} ,oa vlQy oknksa fd la[;k ${values.unsuccessful} gSA`;

  return [
    { text: 'lsok esa]', gapAfter: 8 },
    { text: 'Jheku~ lfpo egksn;]', indent: 12, gapAfter: 3 },
    { text: 'ftyk fof/kd lsok izkf/kdkj] lkgscxatA', indent: 12, gapAfter: 10 },
    { text: 'egksn;]', gapAfter: 5 },
    {
      text: `fuosnu iqoZd dguk gS fd e?;LFk vf/koDrk Jh jchUnz ukFk eaMy ds }kjk ${cases} ekfld izfrosnu ,oa tk¡pksijkUr lgh tk;k x;k gSA`,
      indent: 12,
      gapAfter: 20,
    },
    {
      text: 'vr% vuqjks/k gS fd fu;ekuqlkj Hkqxrku gsrq Jheku~ lfpo egksn; ftyk fof/kd lsok izkf/kdkj lkgscxat dks Hkstk tkrk gSA',
      indent: 45,
      gapAfter: 35,
    },
    { text: 'lgk;d@fyfid', indent: 92, gapAfter: 3,  },
    { text: 'vuqeaMy fof/kd lsok lfefr]', indent: 80, gapAfter: 3,  },
    { text: 'jktegy ftyk lkgscxat', indent: 83, gapAfter: 0, },
  ];
}

export async function generateLipikApplication(
  data: ApplicationReportData,
): Promise<void> {
  await downloadApplicationPdf(
    'krutidev-010-hindi-font.ttf',
    getLipikParagraphs(data),
    `Lipik_Application_${data.month}_${data.year}.pdf`,
  );
}

export async function printLipikApplication(data: ApplicationReportData): Promise<void> {
  await printApplication(
    'krutidev-010-hindi-font.ttf',
    getLipikParagraphs(data),
  );
}
