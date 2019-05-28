import { spawnSync } from 'child_process';
import { expect } from 'chai';
import * as fs from 'fs-extra';
import { describe, it } from 'mocha';
import { LOG } from '../../src/utils';
import { CLASP } from '../constants';
import { cleanup, setup } from '../functions';

describe('Test clasp create function', () => {
  before(setup);
  it('should prompt for a project name correctly', () => {
    spawnSync('rm', ['.clasp.json']);
    const result = spawnSync(
      CLASP, ['create'], { encoding: 'utf8' },
    );
    expect(result.stdout).to.contain(LOG.CREATE_SCRIPT_QUESTION);
  });
  it('should not prompt for project name', () => {
    fs.writeFileSync('.clasp.json', '');
    const result = spawnSync(
      CLASP, ['create'], { encoding: 'utf8' },
    );
    expect(result.stderr).to.contain('Project file (.clasp.json) already exists.');
  });
  after(cleanup);
});

// TODO: this test needs to be updated
describe('Test clasp create <title> function', () => {
  before(setup);
  it('should create a new project named <title> correctly', () => {
    spawnSync('rm', ['.clasp.json']);
    const result = spawnSync(
      CLASP, ['create', '--type', 'Standalone', '--title', 'myTitle'], { encoding: 'utf8' },
    );
    expect(result.stdout).to.contain('Created new Standalone script: https://script.google.com/d/');
    expect(result.status).to.equal(0);
  });
});

describe('Test clasp create <parentId> function', () => {
  before(setup);
  it('should not prompt for script types with parentId', () => {
    spawnSync('rm', ['.clasp.json']);
    const result = spawnSync(
      CLASP, ['create', '--parentId', '"1D_Gxyv*****************************NXO7o"'], { encoding: 'utf8' },
    );
    expect(result.stdout).to.not.contain(LOG.CREATE_SCRIPT_QUESTION);
    expect(result.stderr).to.contain('Request contains an invalid argument.');
  });
  after(cleanup);
});