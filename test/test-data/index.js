module.exports = {
  csvStrings: {
    example: `
        Account,Inflow,Description,Date
        ABC123,420.69,Hello World,2020-02-01
    `,
    valid: `
        Rekeningnummer;Rubrieknaam;Naam;Munt;Afschriftnummer;Datum;Omschrijving;Valuta;Bedrag;Saldo;credit;debet;rekeningnummer tegenpartij;BIC tegenpartij;Naam tegenpartij;Adres tegenpartij;gestructureerde mededeling;Vrije mededeling
BE11123456789012;                                                  ;SMITH JOHN;EUR;  02018038;28/02/2018;BIJDRAGE 01-02-2018 - 28-02-2018     28-02 KBC-PLUSREKENING;28/02/2018;-3,40;219,95;              ;-3,40;                                  ;           ;                                                                       ;                                                                       ;                                   ;                                                                                                                                            
        `,
    validFilename: "export_BE11123456789012_20180304_1422",
    invalid: "LOL N0PE"
  }
};
