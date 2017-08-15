import * as pkg from '../../src';
import Button from '../../src/button';
import CustomSelect from '../../src/custom-select';
import FilteredList from '../../src/filtered-list';
import Icon from '../../src/icon';
import Link from '../../src/link';
import List from '../../src/list';
import ListItem from '../../src/list-item';
import NativeSelect from '../../src/native-select';
import Raw from '../../src/raw';
import Select from '../../src/select';
import SelectOption from '../../src/select-option';
import Toggle from '../../src/toggle';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose Button', () => {
    expect(pkg.Button).to.eq(Button);
  });

  it('should expose CustomSelect', () => {
    expect(pkg.CustomSelect).to.eq(CustomSelect);
  });

  it('should expose FilteredList', () => {
    expect(pkg.FilteredList).to.eq(FilteredList);
  });

  it('should expose Icon', () => {
    expect(pkg.Icon).to.eq(Icon);
  });

  it('should expose Link', () => {
    expect(pkg.Link).to.eq(Link);
  });

  it('should expose List', () => {
    expect(pkg.List).to.eq(List);
  });

  it('should expose ListItem', () => {
    expect(pkg.ListItem).to.eq(ListItem);
  });

  it('should expose NativeSelect', () => {
    expect(pkg.NativeSelect).to.eq(NativeSelect);
  });

  it('should expose Raw', () => {
    expect(pkg.Raw).to.eq(Raw);
  });

  it('should expose Select', () => {
    expect(pkg.Select).to.eq(Select);
  });

  it('should expose SelectOption', () => {
    expect(pkg.SelectOption).to.eq(SelectOption);
  });

  it('should expose Toggle', () => {
    expect(pkg.Toggle).to.eq(Toggle);
  });
});
