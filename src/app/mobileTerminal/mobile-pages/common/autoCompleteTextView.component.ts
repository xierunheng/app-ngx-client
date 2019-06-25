import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {ObservableArray} from "tns-core-modules/data/observable-array";
import {TokenModel} from "nativescript-ui-autocomplete";
import {RadAutoCompleteTextViewComponent} from "nativescript-ui-autocomplete/angular";

@Component({
  selector: "mes-m-radAutoCompleteTextView",
  moduleId: module.id,
  templateUrl: "./autoCompleteTextView.component.html",
  styleUrls: [],
  providers: []
})
export class AutoCompleteTextViewComponent implements OnInit{

  @ViewChild("autocomplete") autocomplete: RadAutoCompleteTextViewComponent;
  private _items: ObservableArray<TokenModel>;

  array:Array<TokenModel> = new Array();

  @Input()
  set items(items: Array<TokenModel>) {
    this.array = items;
  }

  constructor(){}

  ngOnInit(): void {
    this.autocomplete.autoCompleteTextView.loadSuggestionsAsync = function (text){
      return new Promise(function (resolve, reject){
        return resolve(this.array);
      });
    }
  }

  get dataItems(): ObservableArray<TokenModel> {
    return this._items;
  }

}
