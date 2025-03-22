export class Locale {
  code !: string;
  name !: string;
}

export class MyI18n {
  static locales: Locale[] = [
    { code: 'en', name: 'English' },
  ];
  static localeCodesToArray = () => {
    return MyI18n.locales.map(obj => obj.code);
  }
  static isDefined = (cd: string) => {
    return MyI18n.locales.some(obj => obj.code === cd);
  }
}
