import { BankFilePattern } from '../types';
import {detectBank} from './filesystem';

// TODO Next: Pass these tests
describe("detectBank", () => {
    it('detects when a file is a BankFile', () => {
        const testFile = "/path/to/test/bank/file.csv";
        const testPatterns: BankFilePattern[] = [{
            account_name: 'Test Account',
            delete_original_file: true,
            parser: 'test',
            pattern: '/path/to/test/*/*.csv',
            save_parsed_file: false,
            upload: false,
            ynab_account_id: '',
            ynab_budget_id: '',
            ynab_flag_color: ''
        }];
        const result = detectBank(testFile, testPatterns);
        expect(result.isBankFile).toBeTruthy();
        expect(result.matchedParser).toBeDefined();
        expect(result.matchedPattern).toBeDefined();
        expect(result.path).toEqual(testFile);
    })

    it('returns isBankFile = false when no bank is detected', () => {
        const testFile = "/other/path/to/test/bank/file.csv";
        const testPatterns: BankFilePattern[] = [{
            account_name: 'Test Account',
            delete_original_file: true,
            parser: 'test',
            pattern: '/path/to/test/*/*.csv',
            save_parsed_file: false,
            upload: false,
            ynab_account_id: '',
            ynab_budget_id: '',
            ynab_flag_color: ''
        }];
        const result = detectBank(testFile, testPatterns);
        expect(result.isBankFile).toBeFalsy();
        expect(result.matchedParser).toBeUndefined();
        expect(result.matchedPattern).toBeUndefined();
        expect(result.path).toEqual(testFile);
    })
})