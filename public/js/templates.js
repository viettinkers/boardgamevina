var TILE_SHEET_TEMPLATE = `
      <md-bottom-sheet class="md-grid" layout="column">
        <div layout="row" layout-align="center center" ng-cloak>
          <h2 class="md-title">{{tileSheetCtrl.getCity()}}</h2>
        </div>
        <div ng-cloak>
          <md-list flex layout="row" layout-align="center center">
            <md-button
                 class="md-raised md-icon-button"
                 aria-label="person"
                 ng-click="tileSheetCtrl.clickBtn('person', $index)"
                 ng-style="btn.styles"
                 ng-repeat="btn in tileSheetCtrl.getBtns() track by $index"
                 ng-class="{'md-primary': $index > 0}">
              <i class="fa fa-male"
                 aria-hidden="true"></i>
            </md-button>
          </md-list>
          <md-list flex layout="row" layout-align="center center">
            <md-button
                 class="md-raised md-icon-button"
                 aria-label="person"
                 ng-click="tileSheetCtrl.clickBtn('town', $index)"
                 ng-style="btn.styles"
                 ng-repeat="btn in tileSheetCtrl.getBtns() track by $index"
                 ng-class="{'md-primary': $index > 0}">
              <i class="fa fa-home"
                 aria-hidden="true"></i>
            </md-button>
          </md-list>
          <md-list flex layout="row" layout-align="center center">
            <md-button
                 class="md-raised md-icon-button"
                 aria-label="enemy"
                 ng-click="tileSheetCtrl.clickBtn('enemy', $index)"
                 ng-repeat="btn in [0, 1, 2, 3, 4, 5] track by $index"
                 ng-class="{'md-primary': $index > 0}">
              <span ng-if="$index > 1">{{$index}}</span>
              <i class="fa fa-user-secret"
                 aria-hidden="true"></i>
            </md-button>
          </md-list>
          <md-list flex layout="row" layout-align="center center">
            <md-button
                 class="md-raised md-icon-button"
                 aria-label="person"
                 ng-click="tileSheetCtrl.clickBtn('fortress', $index)"
                 ng-style="btn.styles"
                 ng-repeat="btn in tileSheetCtrl.getBtns() track by $index"
                 ng-class="{'md-primary': $index > 0}">
              <i class="fa fa-building"
                 aria-hidden="true"></i>
            </md-button>
          </md-list>
          <md-list flex layout="row" layout-align="center center">
            <md-button
                 ng-click="tileSheetCtrl.clickBtn('clear', 0)"
                 class="md-raised"
                 aria-label="clear">
              Xóa
            </md-button>
          </md-list>
        </div>
      </md-bottom-sheet>
      `;