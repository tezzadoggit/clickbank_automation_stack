interface OfferDetailProps {
  offerId: number;
}

export default function OfferDetail({ offerId }: OfferDetailProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Offer Detail #{offerId}</h1>
      <p className="text-gray-600 mt-2">Detailed view for offer {offerId}</p>
    </div>
  );
}
