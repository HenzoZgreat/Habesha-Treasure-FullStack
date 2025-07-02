package com.HabeshaTreasure.HabeshaTreasure.Service;


import com.HabeshaTreasure.HabeshaTreasure.Entity.AdminSettings.Setting;
import com.HabeshaTreasure.HabeshaTreasure.Repository.SettingRepository;
import com.HabeshaTreasure.HabeshaTreasure.Entity.NotificationType;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class SettingService {

    @Autowired
    private final SettingRepository settingRepository;
    @Autowired
    private final NotificationService notificationService;


    public Setting getSettings() {
        return settingRepository.findAll().stream().findFirst().orElse(null);
    }

    public Setting updateSettings(Setting updatedSettings) {
        Setting existing = getSettings();
        if (existing != null) {
            updatedSettings.setId(existing.getId());
        }
        Setting saved = settingRepository.save(updatedSettings);

        // 🔔 Create notification for admin
        notificationService.createNotification(
                "Settings were updated by admin.",
                NotificationType.SETTINGS,
                null // global notification
        );

        return saved;
    }
}

