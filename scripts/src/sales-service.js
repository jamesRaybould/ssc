var selectOffer = function(){
  var polarisDmp = parseDocumentCookie(document.cookie);
  if (!polarisDmp.hasPackage('sports') && !polarisDmp.hasPackage('movies')) {
      return 'movies';
  }else if (!polarisDmp.hasPackage('movies') && polarisDmp.hasPackage('sports')) {
      return 'movies';
  }else if (polarisDmp.hasPackage('movies') && !polarisDmp.hasPackage('sports')) {
      return 'sports';
  }
  return 'generic';
}

var offerType = selectOffer();
var element = document.getElementById(offerType);
element.style.display='block';
