from datetime import datetime, timedelta

def calculate_streaks(dates):
    if not dates:
        return {"current": 0, "longest": 0, "activeDaysThisWeek": []}

    dates = sorted(set(datetime.strptime(str(d), "%Y-%m-%d") for d in dates))
    
    current_streak = 1
    longest_streak = 1
    streak = 1

    today = datetime.today().date()
    yesterday = today - timedelta(days=1)

    for i in range(1, len(dates)):
        if (dates[i].date() - dates[i - 1].date()).days == 1:
            streak += 1
            longest_streak = max(longest_streak, streak)
        else:
            streak = 1

    if dates[-1].date() == today or dates[-1].date() == yesterday:
        current_streak = streak
    else:
        current_streak = 0

    start_of_week = today - timedelta(days=today.weekday())  # Monday
    active_days = [d.strftime("%a") for d in dates if d.date() >= start_of_week]

    return {
        "current": current_streak,
        "longest": longest_streak,
        "activeDaysThisWeek": sorted(set(active_days))
    }
