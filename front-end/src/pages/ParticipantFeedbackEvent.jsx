import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faMapMarkerAlt,
  faUsers,
  faStar as faStarSolid,
  faPaperPlane,
  faCheckCircle,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { createEventFeedback } from "../services/EventFeedbackService";
import { getEventById } from "../services/EventService"; // Hàm lấy chi tiết event

const ParticipantFeedbackEvent = ({ accountId = 1 }) => {
  const { id: eventId } = useParams();
  const [event, setEvent] = useState(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(eventId);
        setEvent(data);
      } catch (err) {
        setError("Không thể tải thông tin sự kiện.");
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Vui lòng chọn số sao");
    if (comment.trim().length < 10)
      return alert("Bình luận tối thiểu 10 ký tự");

    setIsSubmitting(true);
    try {
      await createEventFeedback(eventId, {
        eventId,
        accountId,
        rating,
        comment,
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setRating(0);
        setComment("");
      }, 100000000);
    } catch (err) {
      setError(err.message || "Lỗi không xác định");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (stars) =>
    ({
      1: "Không hài lòng",
      2: "Kém",
      3: "Bình thường",
      4: "Tốt",
      5: "Xuất sắc",
    }[stars] || "");

  const getRatingColor = (stars) =>
    ({
      1: "text-red-500",
      2: "text-orange-500",
      3: "text-yellow-500",
      4: "text-blue-500",
      5: "text-green-500",
    }[stars] || "");

  if (!event) {
    return (
      <div className="text-center p-10 text-gray-500">
        Đang tải thông tin sự kiện...
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Hero */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        <img
          src={
            event.bannerUrl ||
            "https://images.unsplash.com/photo-1542751110-97427bbecf20"
          }
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {event.category || "Sự kiện"}
              </span>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Đã kết thúc
              </span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              {event.title}
            </h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-white/90">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="w-5 h-5 text-purple-400"
                />
                <span>{new Date(event.startTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="w-5 h-5 text-purple-400"
                />
                <span>{event.location || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="w-5 h-5 text-purple-400"
                />
                <span>{event.maxParticipants} người tham dự</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Section */}
      <div className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          {isSubmitted ? (
            <div className="text-center bg-white shadow-lg rounded-xl p-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-600 text-4xl"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Cảm ơn bạn!
              </h2>
              <p className="text-gray-600 mb-4">
                Đánh giá của bạn đã được ghi nhận.
              </p>
              <div className="flex justify-center space-x-1 mb-2 text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FontAwesomeIcon
                    key={s}
                    icon={faStarSolid}
                    className={s <= rating ? "" : "text-gray-300"}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Đánh giá: {rating}/5 - {getRatingText(rating)}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center space-x-3 mb-1">
                  <FontAwesomeIcon icon={faCommentDots} className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Đánh giá sự kiện</h2>
                </div>
                <p className="text-purple-100">
                  Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Star */}
                <div className="text-center">
                  <p className="text-gray-700 font-medium mb-2">
                    Mức độ hài lòng
                  </p>
                  <div className="flex justify-center space-x-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="cursor-pointer"
                      >
                        <FontAwesomeIcon
                          icon={faStarSolid}
                          className={`text-3xl transition-all duration-200 ${
                            s <= (hoverRating || rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="h-6 mt-3 overflow-hidden relative">
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ${
                        (hoverRating || rating) > 0
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-6"
                      } font-semibold ${getRatingColor(hoverRating || rating)}`}
                    >
                      {(hoverRating || rating) > 0 &&
                        `${getRatingText(hoverRating || rating)} (${
                          hoverRating || rating
                        }/5)`}
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Bình luận chi tiết
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full h-28 p-3 border-2 border-gray-200 rounded-lg focus:ring-purple-200 focus:border-purple-500"
                    placeholder="Tối thiểu 10 ký tự..."
                    maxLength={1000}
                  />
                  <div className="text-sm text-right mt-1 text-gray-500">
                    {comment.length}/1000
                  </div>
                  {comment.length > 0 && comment.length < 10 && (
                    <p className="text-red-500 text-sm">
                      Cần thêm {10 - comment.length} ký tự nữa
                    </p>
                  )}
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={
                    isSubmitting || rating === 0 || comment.trim().length < 10
                  }
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        className="w-5 h-5"
                      />
                      <span>Gửi đánh giá</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700 text-center">
                  💡 Đánh giá của bạn sẽ giúp chúng tôi tổ chức các sự kiện tốt
                  hơn trong tương lai
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantFeedbackEvent;
