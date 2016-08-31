/**
 * Created by paridhisharma on 28/7/16.
 */
import _ from 'lodash';

/**
 *
 * @param obj - GTM object
 */
export function setDataLayerData(obj) {
  window.dataLayer.push(obj);
}

/**
 *
 * @param item
 * @returns {Integer}
 */
function getCategoryId(item) {
  const { product, categoryMap, ancestors } = item;
  const categoryMap1 = (product && product.categoryMap) || categoryMap || ancestors;
  if (categoryMap1 && categoryMap1.length) {
    if (categoryMap1[categoryMap1.length - 1].url_type === 'product') {
      categoryMap1.pop();
    }
    let catId = [];
    categoryMap1.forEach(level => {
      if (level.id) {
        catId.push(level.id);
      }
    });
    catId = catId.join('/');
    return catId;
  }
  return '';
}

/**
 *
 * @param item
 * @returns {String}
 */
function getBrandName(item) {
  const longDesc = item.long_rich_text;
  const brand = item.brand;
  if (brand) {
    return brand;
  }
  if (longDesc && longDesc.length && longDesc[0].attributes && longDesc[0].attributes.Brand) {
    return longDesc[0].attributes.Brand;
  }
  return '';
}


/**
 *
 * @param item
 * @returns {String}
 */
function getCategoryName(item) {
  const { category, product, categoryMap, ancestors } = item;
  let categoryName = item.vertical_label || category;
  const categoryMap1 = (product && product.categoryMap) || categoryMap || ancestors;
  if (categoryName && categoryName.indexOf('->' > -1)) {
    const categoryNamearray = categoryName.split('->');
    categoryName = categoryNamearray.join('/');
    categoryName = categoryName.substring(0, categoryName.length - 1);
  }
  if (categoryMap1 && categoryMap1.length) {
    if (categoryMap1[categoryMap1.length - 1].url_type === 'product') {
      categoryMap1.pop();
    }
    let catName = [];
    categoryMap1.forEach(level => {
      if (level.id) {
        catName.push(level.name);
      }
    });
    catName = catName.join('/');
    return catName;
  }
  return categoryName;
}

/**
 *
 * @param item
 * @param isDigital
 * @returns {Product Object}
 */
export function getProductObject(item, isDigital) {
  let obj = {};
  const { name, id, price, brand, position, priority } = item;
  if (item) {
    const merchantId = item.merchant ? item.merchant.merchant_id : item.merchant_id;
    const categoryIds = getCategoryId(item);
    obj = {
      name,
      id: item.product_id || id,
      price: price || item.offer_price || '',
      brand: brand || getBrandName(item) || '',
      category: getCategoryName(item) || '',
      dimension27: item.parent_id || item.product_id || id
    };
    if (categoryIds) {
      obj.dimension42 = categoryIds;
    }
    if (merchantId) {
      obj.dimension40 = merchantId;
    }
    if (item.list_id) {
      obj.dimension36 = item.list_id;
    }
    if (!isDigital) {
      obj.position = position || priority || 1;
      obj.dimension22 = obj.position;
    }
  }
  return obj;
}

/**
 *
 * @param item
 * @param action
 * @param listType
 * @param listId
 * @param isDigital
 * @returns {GTM Product Object}
 */
export function getProductEcommerceObject(item, action, listType, listId, isDigital) {
  const productObject = getProductObject(item, isDigital);
  const ecommerceObject = {};

  if (!productObject.category) {
    delete productObject.category;
  }
  ecommerceObject[action] = {};
  ecommerceObject.currencyCode = 'INR';


  if (listType) {
    productObject.dimension21 = listType;
    ecommerceObject[action].actionField = {
      list: listType
    };
  }
  if (listId && listId !== '') {
    productObject.dimension36 = listId;
  }
  ecommerceObject[action].products = [productObject];
  return ecommerceObject;
}


/**
 *
 * @param item
 * @param action
 * @returns {GTM Promotion Object}
 */
export function getPromoEcommerceObject(item, action) {
  const { id, name, position, priority } = item;
  const promotionsObject = {
    id,
    creative: name,
    position: position || priority || 1
  };
  if (action) {
    const promoEcommerceObject = {};
    promoEcommerceObject[action] = {};
    promoEcommerceObject[action].promotions = [promotionsObject];
    return promoEcommerceObject;
  }
  return promotionsObject;
}

/**
 *
 * @param index
 * @param prod
 * @param gaKey
 * @param listName
 * @param listId
 * @param isDigital
 */
export function sendGTMDataOnProductClick(index, product, gaKey, listName, listId) {
  const prod = product;
  const catname = (prod.name ? `${gaKey}-${listName}${gaKey}` : gaKey) + (prod.source || '');
  prod.position = (index + 1);
  const ecommerceObject = getProductEcommerceObject(prod, 'click', catname, listId);
  setDataLayerData({ event: 'productClick', ecommerce: ecommerceObject });
}


/**
 *
 * @param product
 * @param gaKey
 */
export function sendGTMDataOnPromoClk(index, product, gaKey, category, destUrl) {
  const prod = product;
  prod.position = (index + 1);
  const ecomObj = getPromoEcommerceObject(product, 'promoClick');
  ecomObj.promoClick.promotions[0].name = `${gaKey}-${category}`;
  setDataLayerData({ event: 'promotionClick', ecommerce: ecomObj, destinationURL: destUrl });
}

/**
 *
 * @param product
 * @param gaKey
 */
export function sendGTMDataOnPromotionView(index, product, gaKey, category) {
  const prod = product;
  prod.position = (index + 1);
  const ecommercePromoObject = getPromoEcommerceObject(product, 'promoView');
  ecommercePromoObject.promoView.promotions[0].name = `${gaKey}-${category}`;
  setDataLayerData({ event: 'promotionImpression', ecommerce: ecommercePromoObject });
}


/**
 *
 * @param prodData
 * @param prodDetails
 * @param gaKey
 * @param grpName
 * @param listId
 */
export function sendGTMDataOnProductView({ prodData, prodDetails, gaKey, grpName, listId }) {
  const productObjects = [];
  prodData.forEach(product => {
    const prod = product;
    prod.position = prodDetails.indexOf(product) + 1;
    prod.list_id = prod.list_id ? prod.list_id : '';
    const prodObj = getProductObject(prod);
    prodObj.dimension21 = (grpName ? `${gaKey}-${grpName}` : gaKey) + (prod.source || '');
    prodObj.list = prodObj.dimension21;
    prodObj.dimension36 = listId;
    delete prodObj.category;
    productObjects.push(prodObj);
  });
  const ecommerceObject = {
    currencyCode: 'INR',
    impressions: productObjects
  };
  setDataLayerData({ event: 'productImpression', ecommerce: ecommerceObject });
}

/**
 *
 * @param groupName
 * @param productData
 * @param gaKey
 */
export function sendGTMDataOnBulkPromotionView({ groupName, productData, productDetails, gaKey }) {
  const ecommerceProducts = [];
  const ecommercePromoObject = {
    promoView: {
      promotions: []
    }
  };

  if (productData && productData.length > 0) {
    for (let i = 0; i < productData.length; i++) {
      const product = productData[i];
      product.position = productDetails.indexOf(product) + 1;
      const ecommerceObject = getPromoEcommerceObject(product);
      ecommerceObject.name = `${gaKey}-${groupName}`;
      ecommerceProducts.push(ecommerceObject);
    }
    ecommercePromoObject.promoView.promotions = ecommerceProducts;
    setDataLayerData({ event: 'promotionImpression', ecommerce: ecommercePromoObject });
  }
}

export function getHeaderItemsTrackingObj(event, userId, pgUrl, media) {
  const obj = {
    user_id: userId,
    category: 'Homepage',
    event,
    action: event,
    label: userId
  };
  if (pgUrl) {
    obj.CURRENT_PAGE_URL = window.location.pathname;
  }
  if (media) {
    obj.SOCIAL_BUTTON_CLICKED = media;
  }
  return obj;
}

export function sendSocialMediaTracking(media, userId) {
  setDataLayerData(getHeaderItemsTrackingObj('social_btn_clicked', userId, null, media));
}

export function sendIconsClickTracking(name, userId, pgUrl) {
  setDataLayerData(getHeaderItemsTrackingObj(name, userId, pgUrl));
}

export function getMenuItemTrackingObj(link, menuitem, userId) {
  const linkSplit = link ? link.split('/') : null;
  const obj = {
    user_id: userId,
    category: 'Homepage',
    MENU_ITEM: linkSplit ? _.last(linkSplit) : '',
    event: 'menu_item_clicked',
    action: 'menu_item_clicked',
    label: userId
  };
  return obj;
}

function getL1MenuTrackingObject(obj) {
  const url = window.location.href;
  return {
    fo_l1_cat_name: obj.itemClicked,
    fo_current_url: url,
    fo_position: obj.idx,
    action: obj.itemClicked,
    label: url,
    category: `flyout_menu_L1${obj.itemClicked}`,
    event: 'fo_menu_l1_clicked'
  };
}

function getL2MenuTrackingObject(obj) {
  let trackObj = {};
  const location = window.location.href;
  if (obj && obj.name) {
    const itemClicked = obj.name;
    trackObj = {
      fo_l1_cat_name: obj.l0,
      fo_l2_cat_name: itemClicked,
      fo_current_url: location,
      fo_position: obj.pIndex.join('.'),
      action: itemClicked,
      label: location,
      category: `flyout_menu_L2_${itemClicked}`,
      event: 'fo_menu_l2_clicked'
    };
  }
  return trackObj;
}

function getL3MenuTrackingObject(obj) {
  let trackObj = {};
  const location = window.location.href;
  if (obj && obj.name) {
    const itemClicked = obj.name;
    trackObj = {
      fo_l1_cat_name: obj.l0,
      fo_l2_cat_name: obj.l1,
      fo_l3_cat_name: itemClicked,
      fo_current_url: location,
      fo_position: obj.pIndex.join('.'),
      action: itemClicked,
      label: location,
      category: `flyout_menu_L3_${itemClicked}`,
      event: 'fo_menu_l3_clicked'
    };
  }
  return trackObj;
}

export function sendL1MenuTracking(itemClicked, idx) {
  setDataLayerData(getL1MenuTrackingObject({ itemClicked, idx }));
}

export function sendL2MenuTracking(itemClicked) {
  setDataLayerData(getL2MenuTrackingObject(itemClicked));
}

export function sendL3MenuTracking(itemClicked) {
  setDataLayerData(getL3MenuTrackingObject(itemClicked));
}


export function sendTopHeaderTracking(item, userInfo) {
  const userId = _.get(userInfo, 'user.info.id', '');
  if (item && item.display_text) {
    setDataLayerData({
      user_id: userId,
      event: 'top_header_clicked',
      top_header_item_name: item.display_text,
      top_header_current_page: window.location.pathname
    });
  }
}

export function sendUserProfileHoverTracking(userInfo) {
  const userId = _.get(userInfo, 'user.info.id', '');
  setDataLayerData({
    event: 'user_account_profile_icon_hovered',
    user_account_user_id: userId
  });
}

export function sendProfileMenuItemClickTracking(name, userInfo) {
  const userId = _.get(userInfo, 'user.info.id', '');
  setDataLayerData({
    event: 'user_account_profile_menu_item_clicked',
    user_account_user_id: userId,
    user_account_profile_menu_item_name: name
  });
}
