window.TourMatching = {
  calculateTotalHours(route) {
    return Number((route.walkHours + route.transportHours + 1).toFixed(1));
  },

  calculatePrice(ride, route) {
    const hours = this.calculateTotalHours(route);
    const extraHours = Math.max(0, hours - 4);
    return Math.round((ride.basePrice + extraHours * ride.hourly) / 1000) * 1000;
  },

  getMatches(people, bags, route) {
    const vehicles = window.TourStore ? TourStore.getRides() : (TOURFORU_DATA.rides || []);
    return vehicles
      .filter(ride => ride.active !== false && ride.capacity >= people && ride.bags >= bags)
      .map(ride => ({
        ...ride,
        totalHours: this.calculateTotalHours(route),
        calculatedPrice: this.calculatePrice(ride, route),
        seatMargin: ride.capacity - people,
        bagMargin: ride.bags - bags
      }))
      .sort((a, b) => {
        const aFit = a.seatMargin + a.bagMargin;
        const bFit = b.seatMargin + b.bagMargin;
        return aFit - bFit || b.guide.rating - a.guide.rating;
      });
  }
};
