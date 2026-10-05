import {
  downloadApplicationPdf,
  formatApplicationCounts,
  printApplication,
  type ApplicationParagraph,
  type ApplicationReportData,
} from './applicationPdf';

export function getSachibParagraphs(data: ApplicationReportData): ApplicationParagraph[] {
  const values = formatApplicationCounts(data);
  const cases = `ekg ${values.month} ${values.year} esa lQy okn ${values.successful} ,oa vlQy oknksa fd la[;k ${values.unsuccessful} gSA dqy lQy okn ${values.successful} ,oa vlQy oknksa fd la[;k ${values.unsuccessful} gSA`;

  return [
    { text: 'lsok esa]', gapAfter: 8 },
    { text: 'Jheku~ lfpo egksn;]', indent: 12, gapAfter: 3 },
    { text: 'ftyk fof/kd lsok izkf/kdkj] lkgscxatA', indent: 12, gapAfter: 10 },
    { text: 'egksn;]', gapAfter: 5 },
    {
      text: `e?;LFk Jh jchUnz ukFk eaMy ds }kjk ${cases} fu’ikfnr iath dk voyksdu fd;k tk ldrk gSA`,
      indent: 12,
      gapAfter: 20,
    },
    {
      text: 'vr% fu;ekuqlkj Hkqxrku gsrq Jheku~ lfpo egksn; ftyk fof/kd lsok izkf/kdkj lkgscxat dks Hkstk tk ldrk gSA',
      indent: 45,
      gapAfter: 40,
    },
    { text: 'lfpo', indent: 90, gapAfter: 3 },
    { text: 'vuqeaMy fof/kd lsok lfefr] jktegy', indent: 60, gapAfter: 0 },
  ];
}

export async function generateSachibApplication(
  data: ApplicationReportData,
): Promise<void> {
  await downloadApplicationPdf(
    'krutidev-010-hindi-font.ttf',
    getSachibParagraphs(data),
    `Sachib_Application_${data.month}_${data.year}.pdf`,
  );
}

export async function printSachibApplication(data: ApplicationReportData): Promise<void> {
  await printApplication(
    'krutidev-010-hindi-font.ttf',
    getSachibParagraphs(data),
  );
}
